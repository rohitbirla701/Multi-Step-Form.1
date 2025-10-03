import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/utils/api";

interface FormState {
  step: number;
  data: Record<string, any>;
  uploading: boolean;
  profilePicUrl?: string | null;
}

export const uploadProfilePic = createAsyncThunk<string, File>(
  "form/uploadProfilePic",
  async (file: File, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await apiClient.post("http://192.168.29.28:9001/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.url) return res.data.url.replace("http://localhost:9001", "http://192.168.29.28:9001");
      return "";
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message || "Upload failed");
    }
  }
);

const savedForm = localStorage.getItem("multiForm");

const initialState: FormState = {
  step: savedForm ? JSON.parse(localStorage.getItem("multiFormStep") || "1") : 1,
  data: savedForm ? JSON.parse(savedForm) : {},
  uploading: false,
  profilePicUrl: savedForm ? JSON.parse(localStorage.getItem("multiFormProfilePic") || "null") : null,
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setFormData: (state, action: PayloadAction<any>) => {
      state.data = { ...state.data, ...action.payload };
      localStorage.setItem("multiForm", JSON.stringify(state.data));
      if (state.profilePicUrl) {
        localStorage.setItem("multiFormProfilePic", JSON.stringify(state.profilePicUrl));
      }
    },
    updateFormField: (state, action: PayloadAction<{ field: string; value: any }>) => {
      state.data[action.payload.field] = action.payload.value;
      localStorage.setItem("multiForm", JSON.stringify(state.data));
    },
    nextStep: (state) => {
      state.step += 1;
      localStorage.setItem("multiFormStep", JSON.stringify(state.step));
    },
    prevStep: (state) => {
      if (state.step > 1) state.step -= 1;
      localStorage.setItem("multiFormStep", JSON.stringify(state.step));
    },
    resetForm: (state) => {
      state.step = 1;
      state.data = {};
      state.uploading = false;
      state.profilePicUrl = null;
      localStorage.removeItem("multiForm");
      localStorage.removeItem("multiFormStep");
      localStorage.removeItem("multiFormProfilePic");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadProfilePic.pending, (state) => {
        state.uploading = true;
      })
      .addCase(uploadProfilePic.fulfilled, (state, action) => {
        state.uploading = false;
        state.profilePicUrl = action.payload;
        state.data.profilePic = action.payload;

        localStorage.setItem("multiForm", JSON.stringify(state.data));
        localStorage.setItem("multiFormProfilePic", JSON.stringify(action.payload));
      })
      .addCase(uploadProfilePic.rejected, (state) => {
        state.uploading = false;
      });
  },
});

export const { setFormData, nextStep, prevStep, resetForm, updateFormField } = formSlice.actions;
export default formSlice.reducer;
