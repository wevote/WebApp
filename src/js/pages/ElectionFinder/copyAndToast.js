import { openSnackbar } from '../../common/components/Widgets/SnackNotifier';

export default function copyAndToast (text) {
  navigator.clipboard.writeText(text);
  openSnackbar({ message: 'Copied!' });
}
