import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/utils/api";

interface FormState {
  step: number;
  data: Record<string, any>;
  uploading: boolean;
  profile_pic_url?: string | null;
}

export const upload_profile_pic = createAsyncThunk<string, File>(
  "form/upload_profile_pic",
  async (file: File, thunk_api) => {
    try {
      const form_data = new FormData();
      form_data.append("file", file);

      const res = await apiClient.post("http://192.168.29.28:9001/upload", form_data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.url)
        return res.data.url.replace("http://localhost:9001", "http://192.168.29.28:9001");
      return "";
    } catch (err: any) {
      return thunk_api.rejectWithValue(err.message || "Upload failed");
    }
  }
);

const saved_form = localStorage.getItem("multi_form");

const initial_state: FormState = {
  step: saved_form ? JSON.parse(localStorage.getItem("multi_form_step") || "1") : 1,
  data: saved_form ? JSON.parse(saved_form) : {},
  uploading: false,
  profile_pic_url: saved_form
    ? JSON.parse(localStorage.getItem("multi_form_profile_pic") || "null")
    : null,
};

const form_slice = createSlice({
  name: "form",
  initialState: initial_state,
  reducers: {
    set_form_data: (state, action: PayloadAction<any>) => {
      state.data = { ...state.data, ...action.payload };
      localStorage.setItem("multi_form", JSON.stringify(state.data));
      if (state.profile_pic_url) {
        localStorage.setItem("multi_form_profile_pic", JSON.stringify(state.profile_pic_url));
      }
    },
    update_form_field: (state, action: PayloadAction<{ field: string; value: any }>) => {
      state.data[action.payload.field] = action.payload.value;
      localStorage.setItem("multi_form", JSON.stringify(state.data));
    },
    next_step: (state) => {
      state.step += 1;
      localStorage.setItem("multi_form_step", JSON.stringify(state.step));
    },
    prev_step: (state) => {
      if (state.step > 1) state.step -= 1;
      localStorage.setItem("multi_form_step", JSON.stringify(state.step));
    },
    reset_form: (state) => {
      state.step = 1;
      state.data = {};
      state.uploading = false;
      state.profile_pic_url = null;
      localStorage.removeItem("multi_form");
      localStorage.removeItem("multi_form_step");
      localStorage.removeItem("multi_form_profile_pic");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(upload_profile_pic.pending, (state) => {
        state.uploading = true;
      })
      .addCase(upload_profile_pic.fulfilled, (state, action) => {
        state.uploading = false;
        state.profile_pic_url = action.payload;
        state.data.profile_pic = action.payload;

        localStorage.setItem("multi_form", JSON.stringify(state.data));
        localStorage.setItem("multi_form_profile_pic", JSON.stringify(action.payload));
      })
      .addCase(upload_profile_pic.rejected, (state) => {
        state.uploading = false;
      });
  },
});

export const {
  set_form_data,
  next_step,
  prev_step,
  reset_form,
  update_form_field,
} = form_slice.actions;

export default form_slice.reducer;
