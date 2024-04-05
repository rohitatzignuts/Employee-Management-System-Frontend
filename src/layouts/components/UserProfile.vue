<script setup lang="ts">
import axios from 'axios';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import { useRouter } from 'vue-router';

const router = useRouter()
const username = localStorage.getItem('username')
const handleLogout = async () => {
  const accessToken = localStorage.getItem('access_token')
  try {
    const response = await axios.post(
      'http://127.0.0.1:8000/api/logout',
      null, // No data to send in the request body
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    if (response.status === 200) {
      router.push('/login')
      localStorage.removeItem('access_token')
      localStorage.removeItem('username')
      Swal.fire({
        title: 'Logged Out Successfully!',
        icon: 'success',
        showConfirmButton: false,
        timer: 500
      })
    }
  } catch (error) {
    console.log(error)
  }
}

</script>

<template>
  <VBadge dot location="bottom right" offset-x="3" offset-y="3" bordered color="success">
    <VAvatar class="cursor-pointer" color="primary" variant="tonal">
      <!-- <VImg :src="avatar1" /> -->

      <!-- SECTION Menu -->
      <VMenu activator="parent" width="230" location="bottom end" offset="14px">
        <VList>
          <!-- 👉 User Avatar & Name -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge dot location="bottom right" offset-x="3" offset-y="3" color="success">
                  <VAvatar color="primary" variant="tonal">
                    AD
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold">
              {{ username }}
            </VListItemTitle>
            <VListItemSubtitle>Admin</VListItemSubtitle>
          </VListItem>

          <VDivider class="my-2" />

          <!-- 👉 Profile -->
          <VListItem link>
            <template #prepend>
              <VIcon class="me-2" icon="tabler-user" size="22" />
            </template>

            <VListItemTitle>Profile</VListItemTitle>
          </VListItem>
          <!-- Divider -->
          <VDivider class="my-2" />

          <!-- 👉 Logout -->
          <VListItem @click="handleLogout">
            <template #prepend>
              <VIcon class="me-2" icon="tabler-logout" size="22" />
            </template>

            <VListItemTitle>Logout</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <!-- !SECTION -->
      AD
    </VAvatar>
  </VBadge>
</template>
