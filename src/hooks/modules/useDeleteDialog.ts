import { Message, Modal } from '@arco-design/web-vue'

// 删除
export const useDeleteDialog = async <T>(
  deleteApi: () => Promise<ApiRes<T>>,
  afterFunction?: () => void,
  options?: { title?: string, content?: string, successTip?: string, showModal?: boolean },
): Promise<boolean | undefined> => {
  const onDelete = async () => {
    try {
      const res = await deleteApi()
      if (res.success) {
        Message.success(options?.successTip || '删除成功')
        if (afterFunction !== undefined) {
          await afterFunction()
        }
      }
      return res.success
    } catch (error) {
      return false
    }
  }
  const flag = options?.showModal ?? true // 是否显示对话框
  if (!flag) {
    return onDelete()
  }
  Modal.warning({
    title: options?.title || '提示',
    content: options?.content || '是否确定删除该条数据？',
    okButtonProps: { status: 'danger' },
    hideCancel: false,
    maskClosable: false,
    onBeforeOk: onDelete,
  })
}
