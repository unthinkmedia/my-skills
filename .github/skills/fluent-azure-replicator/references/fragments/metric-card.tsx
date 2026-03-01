/**
 * Fragment: Metric Card (KPI)
 *
 * Dashboard-style card showing a single metric with title, value, and subtitle.
 * Use inside a grid layout (see dashboard canonical example).
 */
import {
  Card,
  Caption1,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

// --- Styles ---
const useStyles = makeStyles({
  card: {
    padding: tokens.spacingVerticalL,
  },
  value: {
    fontSize: tokens.fontSizeHero700,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightHero700,
    color: tokens.colorNeutralForeground1,
    margin: `${tokens.spacingVerticalXS} 0`,
  },
});

// --- Component ---
interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle }) => {
  const styles = useStyles();
  return (
    <Card appearance="outline" className={styles.card}>
      <Caption1>{title}</Caption1>
      <div className={styles.value}>{value}</div>
      {subtitle && <Caption1>{subtitle}</Caption1>}
    </Card>
  );
};
