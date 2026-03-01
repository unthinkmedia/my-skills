import React from 'react';
import {
  FluentProvider,
  Subtitle1,
  Subtitle2,
  Body1,
  Caption1,
  Card,
  Button,
} from '@fluentui/react-components';
import { azureLightTheme, azureDarkTheme } from '../resource-blade/theme';
import { useStyles } from './styles';
import { kpiMetrics, recentResources } from './data';
import { EditIcon } from './icons';

interface DashboardProps {
  darkMode?: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ darkMode = false }) => {
  const styles = useStyles();

  return (
    <FluentProvider theme={darkMode ? azureDarkTheme : azureLightTheme}>
      <div className={styles.root}>
        {/* Header */}
        <header className={styles.header}>
          <Subtitle1>Dashboard</Subtitle1>
          <Button appearance="subtle" icon={<EditIcon />} aria-label="Edit dashboard">
            Edit
          </Button>
        </header>

        {/* Scrollable Content */}
        <main className={styles.scrollContent}>
          {/* KPI Cards */}
          <Subtitle2 className={styles.sectionTitle}>Overview</Subtitle2>
          <div className={styles.grid}>
            {kpiMetrics.map((metric) => (
              <Card key={metric.title} appearance="outline" className={styles.kpiCard}>
                <Caption1>{metric.title}</Caption1>
                <div className={styles.kpiValue}>{metric.value}</div>
                <Caption1>{metric.subtitle}</Caption1>
              </Card>
            ))}
          </div>

          {/* Recent Resources */}
          <Subtitle2 className={styles.sectionTitle}>Recent resources</Subtitle2>
          <Card appearance="outline" className={styles.cardFull}>
            {recentResources.map((resource) => (
              <div key={resource.name} className={styles.recentRow}>
                <div>
                  <Body1 className={styles.resourceLink}>{resource.name}</Body1>
                  <Caption1>{resource.type}</Caption1>
                </div>
                <Caption1>{resource.lastAccessed}</Caption1>
              </div>
            ))}
          </Card>
        </main>
      </div>
    </FluentProvider>
  );
};

export default Dashboard;
