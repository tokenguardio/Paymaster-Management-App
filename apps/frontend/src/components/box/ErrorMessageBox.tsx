import { Typography } from '@/components';
import Style from './ErrorMessageBox.module.css';

type TErrorMessageBoxProps = {
  errorMessage: string;
};

export const ErrorMessageBox = ({ errorMessage }: TErrorMessageBoxProps) => {
  return (
    <div className={Style['error-box']}>
      <Typography
        tag="p"
        text={errorMessage}
        size="xs"
        color="red500"
        weight="regular"
        style="italic"
      />
    </div>
  );
};
