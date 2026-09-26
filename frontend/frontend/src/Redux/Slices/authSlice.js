import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { setAccessToken, clearAccessToken } from "../../Services/api";

export const registerStart = createAsyncThunk(
  "auth/registerStart",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/register/start", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Could not start registration."
      );
    }
  }
);

export const verifyRegisterEmail = createAsyncThunk(
  "auth/verifyRegisterEmail",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/register/verify-email", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Email verification failed."
      );
    }
  }
);

export const resendRegisterOTP = createAsyncThunk(
  "auth/resendRegisterOTP",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/register/resend", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Could not resend OTP."
      );
    }
  }
);

export const completeRegistration = createAsyncThunk(
  "auth/completeRegistration",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/register/complete", data);
      // No setAccessToken here so user lands on login page unauthenticated
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed."
      );
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", data);
      setAccessToken(response.data.accessToken);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed."
      );
    }
  }
);

export const requestLoginOTP = createAsyncThunk(
  "auth/requestLoginOTP",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login/request-otp", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Could not send OTP."
      );
    }
  }
);

export const verifyLoginOTP = createAsyncThunk(
  "auth/verifyLoginOTP",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login/verify-otp", data);
      setAccessToken(response.data.accessToken);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "OTP verification failed."
      );
    }
  }
);

export const refreshAccessToken = createAsyncThunk(
  "auth/refreshAccessToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/refresh");

      if (response.data.authenticated === false) {
        clearAccessToken();
        return {
          authenticated: false,
          accessToken: null
        };
      }

      setAccessToken(response.data.accessToken);
      return response.data;
    } catch (error) {
      clearAccessToken();
      return rejectWithValue(
        error.response?.data?.message || "Session expired."
      );
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/me");
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Could not get current user."
      );
    }
  }
);

export const initializeAuth = createAsyncThunk(
  "auth/initializeAuth",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const refreshResponse = await dispatch(refreshAccessToken()).unwrap();

      if (refreshResponse.authenticated === false) {
        clearAccessToken();
        return {
          accessToken: null,
          user: null
        };
      }

      const accessToken = refreshResponse.accessToken;
      setAccessToken(accessToken);

      const user = await dispatch(getCurrentUser()).unwrap();

      return {
        accessToken,
        user
      };
    } catch (error) {
      clearAccessToken();
      return rejectWithValue(error?.message || "Not authenticated.");
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/logout");
      clearAccessToken();
      return response.data;
    } catch (error) {
      clearAccessToken();
      return rejectWithValue(
        error.response?.data?.message || "Logout failed."
      );
    }
  }
);

export const logoutAllDevices = createAsyncThunk(
  "auth/logoutAllDevices",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/logout-all");
      clearAccessToken();
      return response.data;
    } catch (error) {
      clearAccessToken();
      return rejectWithValue(
        error.response?.data?.message || "Could not logout from all devices."
      );
    }
  }
);

const initialState = {
  user: null,
  accessToken: null,
  loading: false,
  authChecking: true,
  error: null,
  registrationId: null,
  emailVerified: false,
  otpChannel: null,
  registrationLoading: false,
  otpLoading: false
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    resetRegistration: (state) => {
      state.registrationId = null;
      state.emailVerified = false;
      state.registrationLoading = false;
      state.otpLoading = false;
      state.error = null;
    }
  },

  extraReducers: (builder) => {
    builder
      // registerStart
      .addCase(registerStart.pending, (state) => {
        state.registrationLoading = true;
        state.error = null;
      })
      .addCase(registerStart.fulfilled, (state, action) => {
        state.registrationLoading = false;
        state.registrationId = action.payload.registrationId;
        state.emailVerified = false;
      })
      .addCase(registerStart.rejected, (state, action) => {
        state.registrationLoading = false;
        state.error = action.payload;
      })

      // verifyRegisterEmail
      .addCase(verifyRegisterEmail.pending, (state) => {
        state.otpLoading = true;
        state.error = null;
      })
      .addCase(verifyRegisterEmail.fulfilled, (state, action) => {
        state.otpLoading = false;
        state.emailVerified = action.payload.emailVerified;
      })
      .addCase(verifyRegisterEmail.rejected, (state, action) => {
        state.otpLoading = false;
        state.error = action.payload;
      })

      // resendRegisterOTP
      .addCase(resendRegisterOTP.pending, (state) => {
        state.otpLoading = true;
        state.error = null;
      })
      .addCase(resendRegisterOTP.fulfilled, (state) => {
        state.otpLoading = false;
      })
      .addCase(resendRegisterOTP.rejected, (state, action) => {
        state.otpLoading = false;
        state.error = action.payload;
      })

      // completeRegistration (No token persistence)
      .addCase(completeRegistration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeRegistration.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.accessToken = null;
        state.registrationId = null;
        state.emailVerified = false;
      })
      .addCase(completeRegistration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // requestLoginOTP
      .addCase(requestLoginOTP.pending, (state) => {
        state.otpLoading = true;
        state.error = null;
      })
      .addCase(requestLoginOTP.fulfilled, (state, action) => {
        state.otpLoading = false;
        state.otpChannel = action.payload.channel;
      })
      .addCase(requestLoginOTP.rejected, (state, action) => {
        state.otpLoading = false;
        state.error = action.payload;
      })

      // verifyLoginOTP
      .addCase(verifyLoginOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyLoginOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.otpChannel = null;
      })
      .addCase(verifyLoginOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // refreshAccessToken
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken || null;
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.accessToken = null;
        state.user = null;
      })

      // getCurrentUser
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.user = null;
      })

      // initializeAuth
      .addCase(initializeAuth.pending, (state) => {
        state.authChecking = true;
        state.error = null;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.authChecking = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.error = null;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.authChecking = false;
        state.user = null;
        state.accessToken = null;
        state.error = null;
      })

      // logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
      })
      .addCase(logout.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
      })

      // logoutAllDevices
      .addCase(logoutAllDevices.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
      })
      .addCase(logoutAllDevices.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
      });
  }
});

export const { clearAuthError, resetRegistration } = authSlice.actions;

export default authSlice.reducer;