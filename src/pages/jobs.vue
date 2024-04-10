<script setup>
import { VDataTable } from "vuetify/labs/VDataTable"
import { useJobsStore } from '@/store/useJobsStore'

const jStore = useJobsStore()
const headers = [
    { title: '', key: 'data-table-expand' },
    { title: "title", key: "title", },
    { title: "By", key: "company_name" },
    { title: "location", key: "location" },
    { title: "Actions", key: "actions" },
];

onMounted(() => {
    jStore.getAllJobs()
})
</script>

<template>
    <div>
        <div class="d-flex align-center justify-space-between">
            <h1>Jobs</h1>
            <VBtn prepend-icon="tabler-plus" @click="handleEmployeeCreate">
                Add New Job
            </VBtn>
        </div>
        <VDivider class="my-4" />
        <VDataTable :headers="headers" :items="jStore.totaljobs" :items-per-page="10" class="pa-3" expand-on-click>
            <template #expanded-row="slotProps">
                <tr class="v-data-table__tr">
                    <td :colspan="headers.length">
                        <h4 class="my-1">
                            Description: {{ slotProps.item.raw.description }}
                        </h4>
                        <p class="my-1">
                            Pay: ${{ slotProps.item.raw.pay }}
                        </p>
                    </td>
                </tr>
            </template>
            <template #item.actions="{ item }">
                <div class="d-flex gap-1">
                    <IconBtn @click="handleEmployeeEdit(item.props.title.id)">
                        <VIcon icon="tabler-edit" />
                    </IconBtn>
                    <IconBtn @click="handleEmployeeDelete(item.props.title.id)">
                        <VIcon icon="tabler-trash" />
                    </IconBtn>
                </div>
            </template>
        </VDataTable>
    </div>
</template>
