const Session = require("../Models/Session");

const {verifyToken} = require("../Services/tokenService");

const authenticateAccessToken = async (req,res,next) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message:"Access token required."
            });
        }

        const token = authHeader.split(" ")[1];

        let decoded;

        try {
            decoded = verifyToken(token);
        } catch {
            return res.status(401).json({
                message: "Invalid or expired access token."
            });
        }

        if (
            decoded.type !== "access" ||
            !decoded.sid
        ) {
            return res.status(401).json({
                message:
                    "Invalid access token."
            });
        }

        const session =
            await Session.findOne({
                sessionId: decoded.sid,
                userId: decoded.id
            });

        if (!session) {
            return res.status(401).json({
                message:
                    "Session not found."
            });
        }

        if (
            session.revokedAt ||
            session.expiresAt.getTime() < Date.now()
        ) {
            return res.status(401).json({
                message:
                    "Session is no longer active."
            });
        }

        req.user = {
            id: decoded.id,
            role: decoded.role,
            sessionId: decoded.sid
        };

        next();

    } catch (error) {

        console.error(
            "authenticateAccessToken:",
            error
        );

        return res.status(500).json({
            message:
                "Authentication failed."
        });
    }
};

const authUser = async (
    req,
    res,
    next
) => {

    await authenticateAccessToken(
        req,
        res,
        () => {

            if (
                !["user", "artist"]
                    .includes(req.user.role)
            ) {
                return res.status(403).json({
                    message:
                        "Access denied."
                });
            }

            next();
        }
    );
};

const authArtist = async (
    req,
    res,
    next
) => {

    await authenticateAccessToken(
        req,
        res,
        () => {

            if (req.user.role !== "artist") {
                return res.status(403).json({
                    message:
                        "Artist access required."
                });
            }

            next();
        }
    );
};

module.exports = {authenticateAccessToken,authUser,authArtist};