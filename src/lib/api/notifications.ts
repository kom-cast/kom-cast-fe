import { apiClient } from './client'
import { toError } from './to-error'

export interface RemoteNotification {
  id: number
  type: string
  title: string
  description: string
  time: string
  unread: boolean
}

export async function getNotifications(): Promise<RemoteNotification[]> {
  try {
    const { data } = await apiClient.get<RemoteNotification[]>('/notifications')
    return data
  } catch (err) {
    throw toError(err, '알림 목록 조회')
  }
}

export async function markNotificationRead(id: number): Promise<void> {
  try {
    await apiClient.patch(`/notifications/${id}/read`)
  } catch (err) {
    throw toError(err, '알림 읽음 처리')
  }
}

export async function markAllNotificationsRead(): Promise<void> {
  try {
    await apiClient.post('/notifications/read-all')
  } catch (err) {
    throw toError(err, '전체 알림 읽음 처리')
  }
}

export interface NotificationSettings {
  notifyBriefing: boolean
  notifyPriceAlert: boolean
  notifyMarketing: boolean
}

export async function getNotificationSettings(): Promise<NotificationSettings> {
  try {
    const { data } = await apiClient.get<NotificationSettings>(
      '/notifications/settings',
    )
    return data
  } catch (err) {
    throw toError(err, '알림 설정 조회')
  }
}

export async function updateNotificationSettings(
  payload: NotificationSettings,
): Promise<void> {
  try {
    await apiClient.patch('/notifications/settings', payload)
  } catch (err) {
    throw toError(err, '알림 설정 변경')
  }
}
