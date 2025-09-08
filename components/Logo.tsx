import { colors } from '@/constants/theme';
import Typo from './Typo';

const Logo = () => {
  return (
    <Typo fontWeight={'900'} size={42} style={{ color: colors.primary }}>
      CLAIR
    </Typo>
  );
};

export default Logo;
