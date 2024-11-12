import type {
  // MessageProviderInst,
  // DialogProviderInst,
  NotificationProviderInst,
  LoadingBarProviderInst,
} from "naive-ui";
import type { FMessageInst } from '@/components/FMessage'
import type { IDialog as FDialogInst } from '@/components/FDialog/type'
declare global {
  interface Window {
    $message: FMessageInst;
    $dialog: FDialogInst;
    $notification: NotificationProviderInst;
    $loadingBar: LoadingBarProviderInst;
  }
}
