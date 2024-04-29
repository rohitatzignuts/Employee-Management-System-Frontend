<script setup lang="ts">
import { PerfectScrollbar } from "vue3-perfect-scrollbar";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { VForm } from "vuetify/components/VForm";
import axios from "axios";
import {
  emailValidator,
  requiredValidator,
} from "../../@core/utils/validators";
import { ref, nextTick, watchEffect } from "vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

interface Props {
  isDrawerOpen: boolean,
  companyId?: number | undefined | null,
}

interface Emit {
  (e: "closeDialog", value: Boolean): void;
  (e: "isCompanyCreated", value: Boolean): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

// refs
const logoFile = ref<string | null>("");
const isEditing = ref<boolean>(false);
const isFormValid = ref<boolean>(false);
const refForm = ref<VForm>();
const getCompanyId = ref<string | number | null>(props.companyId ?? null);
const companyData = ref({
  name: "",
  logo: "",
  website: "",
  cmp_email: "",
  location: "",
  is_active: false,
});
const cmpAdminData = ref({
  first_name: "",
  last_name: "",
  email: "",
  joining_date: null,
});

// 👉 select different image/logo
const onLogoChange = (e: any) => {
  logoFile.value = e.target.files[0];
};

// 👉 drawer close
const closeNavigationDrawer = () => {
  emit("closeDialog", false);
  isEditing.value = false;

  nextTick(() => {
    refForm.value?.reset();
    companyData.value.logo = "";
    cmpAdminData.value.joining_date = null;
    refForm.value?.resetValidation();
    logoFile.value = "";
  });
};

// 👉 get the company data on the basis of ID
const getCompanyData = async (comId: string | number) => {
  try {
    const access_token = localStorage.getItem("access_token");
    const response = await axios.get(`company/${comId}}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "content-type": "multipart/form-data",
      },
    });

    (companyData.value.name = response.data.data.name),
      (companyData.value.location = response.data.data.location),
      (companyData.value.cmp_email = response.data.data.cmp_email),
      (companyData.value.is_active = response.data.data.is_active),
      (companyData.value.logo = response.data.data.logo),
      (companyData.value.website = response.data.data.website),
      (cmpAdminData.value.email = response.data.data.company_admin.email);
    cmpAdminData.value.first_name = response.data.data.company_admin.first_name;
    cmpAdminData.value.joining_date =
      response.data.data.company_admin.joining_date;
    cmpAdminData.value.last_name = response.data.data.company_admin.last_name;
    // clear getCompanyId
    getCompanyId.value = null;
    // manage active/ deactive state of the company
    if (response.data.data.is_active) {
      companyData.value.is_active = true;
    } else {
      companyData.value.is_active = false;
    }
  } catch (error) {
    console.error("Error getting data:", error);
  }
};

// 👉 edit existig company and create a new company
const onSubmit = async () => {
  try {
    // check form validation
    refForm.value?.validate().then(async (res) => {
      if (res.valid) {
        // handle image/file submission
        const formData = new FormData();
        formData.append("logo", logoFile.value);
        let input = {
          logo: logoFile.value,
          name: companyData.value.name,
          website: companyData.value.website,
          cmp_email: companyData.value.cmp_email,
          location: companyData.value.location,
          is_active: companyData.value.is_active ? 1 : 0,
          first_name: cmpAdminData.value.first_name,
          last_name: cmpAdminData.value.last_name,
          email: cmpAdminData.value.email,
          joining_date: cmpAdminData.value.joining_date,
        };
        isEditing.value = props.companyId ? true : false;
        //dynamiclly change main URL on the basis of 'props.companyId'
        const url = props.companyId
          ? `company/update/${props.companyId}`
          : `company/create`;
        const response = await axios.post(url, input, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "content-type": "multipart/form-data",
          },
        });
        if (response) {
          emit("isCompanyCreated", true);
          toast(`${response.data.message}`, {
            type: "success",
          });
          isEditing.value = false;
          closeNavigationDrawer();
        } else {
          refForm.value?.reset();
          refForm.value?.resetValidation();
        }
      }
    });
  } catch (error: any) {
    toast(`Error Creating Company : ${error.message}`, {
      type: "error",
    });
  }
};

watchEffect(() => {
  // Check if an companyId ID is provided
  if (props.companyId) {
    isEditing.value = true;
    getCompanyId.value = props.companyId;
    // Fetch company details
    getCompanyData(props.companyId);
  } else {
    // Reset values if no company ID is provided
    isEditing.value = false;
    getCompanyId.value = null;
  }
});
</script>

<template>
  <VNavigationDrawer
    temporary
    :width="400"
    location="end"
    class="scrollable-content"
    :model-value="props.isDrawerOpen"
  >
    <!-- 👉 Title -->
    <AppDrawerHeaderSection
      :title="isEditing ? 'Edit Company' : 'Add Company'"
      @cancel="closeNavigationDrawer"
    />
    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <!-- 👉 Form -->
          <VForm
            v-model="isFormValid"
            ref="refForm"
            enctype="multipart/form-data"
            @submit.prevent="onSubmit"
          >
            <VRow>
              <!-- 👉 Company Name -->
              <VCol cols="12">
                <AppTextField
                  v-model="companyData.name"
                  :rules="[requiredValidator]"
                  label="Company Name"
                />
              </VCol>

              <!-- 👉 Company Email -->
              <VCol cols="12">
                <AppTextField
                  v-model="companyData.cmp_email"
                  :rules="[requiredValidator, emailValidator]"
                  label="Company Email"
                />
              </VCol>

              <!-- 👉 company website -->
              <VCol cols="12">
                <AppTextField
                  v-model="companyData.website"
                  :rules="[requiredValidator]"
                  label="Company Website"
                />
              </VCol>

              <!-- 👉 company address -->
              <VCol cols="12">
                <AppTextField
                  v-model="companyData.location"
                  :rules="[requiredValidator]"
                  label="Company Address"
                />
              </VCol>

              <!-- 👉 company Logo -->
              <VCol cols="12" v-if="!props.companyId">
                <VLabel class="text-subtitle-2 pb-4">Company Logo</VLabel>
                <input
                  :rules="[]"
                  type="file"
                  accept="image/*"
                  label="Company Logo"
                  prepend-icon="mdi-camera"
                  @change="onLogoChange"
                />
              </VCol>

              <VDivider class="my-4" />

              <!-- 👉 Company Admin First Name -->
              <VCol cols="12">
                <AppTextField
                  v-model="cmpAdminData.first_name"
                  :rules="[requiredValidator]"
                  label="Company Admin First Name"
                />
              </VCol>

              <!-- 👉 Company Admin last Name -->
              <VCol cols="12">
                <AppTextField
                  v-model="cmpAdminData.last_name"
                  :rules="[requiredValidator]"
                  label="Company Admin Last Name"
                />
              </VCol>

              <!-- 👉 Company Admin Email -->
              <VCol cols="12">
                <AppTextField
                  v-model="cmpAdminData.email"
                  :rules="[requiredValidator, emailValidator]"
                  type="email"
                  label="Company Admin Email"
                />
              </VCol>

              <!-- 👉 Company Admin Joining Date -->
              <VCol cols="12">
                <AppDateTimePicker
                  v-model="cmpAdminData.joining_date"
                  :rules="[requiredValidator]"
                  label="Company Admin Joining Date"
                  placeholder="Select Joining date"
                />
              </VCol>

              <!-- 👉 Company Status -->
              <VCol cols="12" v-if="props.companyId">
                <VSwitch label="Active" v-model="companyData.is_active" />
              </VCol>

              <!-- 👉 Submit and Cancel -->
              <VCol cols="12">
                <VBtn type="submit" class="me-3">
                  {{ isEditing ? `Edit` : `Create` }}
                </VBtn>
                <VBtn
                  type="reset"
                  variant="tonal"
                  color="secondary"
                  @click="closeNavigationDrawer"
                >
                  Cancel
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
