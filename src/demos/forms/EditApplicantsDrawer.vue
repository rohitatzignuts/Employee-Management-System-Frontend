<script setup lang="ts">
import { PerfectScrollbar } from "vue3-perfect-scrollbar";

interface Emit {
    (e: "closeDialog", value: Boolean): void;

}

interface Props {
    isDrawerOpen: boolean;

}

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

const closeNavigationDrawer = () => {
    emit("closeDialog", false);
    //   isEditing.value = false;

    //   nextTick(() => {
    //     refForm.value?.reset();
    //     empData.value.joining_date = null;
    //     refForm.value?.resetValidation();
    //   });
};
</script>

<template>
    <div>
        <VNavigationDrawer :model-value="props.isDrawerOpen" temporary :width="400" location="end"
            class="scrollable-content">
            <AppDrawerHeaderSection title="Edit Applicant" @cancel="closeNavigationDrawer" />
            <PerfectScrollbar :options="{ wheelPropagation: false }">
                <VCard flat>
                    <VCardText>
                        hi
                    </VCardText>
                </VCard>
            </PerfectScrollbar>
        </VNavigationDrawer>

    </div>
</template>

<style lang="scss" scoped></style>
