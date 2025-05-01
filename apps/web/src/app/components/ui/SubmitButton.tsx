import React from 'react';
import { Button } from 'antd';
import type { ButtonProps } from 'antd';

interface SubmitButtonProps extends ButtonProps {
  loading?: boolean;
  text: string;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  loading,
  text,
  ...props
}) => {
  return (
    <Button type="primary" htmlType="submit" loading={loading} block {...props}>
      {text}
    </Button>
  );
};

export default SubmitButton;
