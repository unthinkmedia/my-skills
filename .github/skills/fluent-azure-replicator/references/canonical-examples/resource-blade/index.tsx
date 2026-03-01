import React, { useState } from 'react';
import {
  FluentProvider,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbDivider,
  Subtitle1,
  Body1,
  Body2,
  Caption1,
  Badge,
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  mergeClasses,
} from '@fluentui/react-components';
import { azureLightTheme, azureDarkTheme } from './theme';
import { useStyles } from './styles';
import {
  breadcrumbItems,
  navItems,
  commandActions,
  essentialsLeft,
  essentialsRight,
} from './data';
import {
  ConnectIcon,
  StartIcon,
  RestartIcon,
  StopIcon,
  DeleteIcon,
  ResourceIcon,
} from './icons';

const iconMap: Record<string, React.FC> = {
  PlugConnected: ConnectIcon,
  Play: StartIcon,
  ArrowClockwise: RestartIcon,
  Stop: StopIcon,
  Delete: DeleteIcon,
};

interface ResourceBladeProps {
  darkMode?: boolean;
}

export const ResourceBlade: React.FC<ResourceBladeProps> = ({ darkMode = false }) => {
  const styles = useStyles();
  const [activeNav, setActiveNav] = useState('overview');

  return (
    <FluentProvider theme={darkMode ? azureDarkTheme : azureLightTheme}>
      <div className={styles.root}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Breadcrumb>
            {breadcrumbItems.map((item, i) => (
              <React.Fragment key={item}>
                {i > 0 && <BreadcrumbDivider />}
                <BreadcrumbItem>{item}</BreadcrumbItem>
              </React.Fragment>
            ))}
          </Breadcrumb>
        </nav>

        {/* Header */}
        <header className={styles.header}>
          <ResourceIcon className={styles.headerIcon} />
          <Subtitle1>vm-prod-west-01</Subtitle1>
          <Badge appearance="filled" color="success" size="small">
            Running
          </Badge>
        </header>

        {/* Body: Sidebar + Content */}
        <div className={styles.body}>
          {/* Side Navigation */}
          <nav className={styles.sidebar} aria-label="Resource navigation">
            {navItems.map((item) => (
              <div
                key={item.value}
                role="button"
                tabIndex={0}
                aria-current={activeNav === item.value ? 'page' : undefined}
                className={mergeClasses(
                  styles.navItem,
                  activeNav === item.value && styles.navItemActive,
                )}
                onClick={() => setActiveNav(item.value)}
                onKeyDown={(e) => e.key === 'Enter' && setActiveNav(item.value)}
              >
                <Body1>{item.label}</Body1>
              </div>
            ))}
          </nav>

          {/* Content Area */}
          <div className={styles.contentArea}>
            {/* Command Bar */}
            <Toolbar aria-label="Resource actions" className={styles.commandBar}>
              {commandActions.map((action, i) => {
                const Icon = iconMap[action.icon];
                return (
                  <React.Fragment key={action.label}>
                    {i === 1 && <ToolbarDivider />}
                    <ToolbarButton
                      appearance={action.primary ? 'primary' : undefined}
                      icon={Icon ? <Icon /> : undefined}
                      aria-label={action.label}
                    >
                      {action.label}
                    </ToolbarButton>
                  </React.Fragment>
                );
              })}
            </Toolbar>

            {/* Scrollable Content */}
            <main className={styles.scrollContent}>
              <Body2>Essentials</Body2>
              <section className={styles.essentialsGrid} aria-label="Resource essentials">
                <div>
                  {essentialsLeft.map((item) => (
                    <div key={item.label} className={styles.essentialRow}>
                      <Caption1 className={styles.essentialLabel}>
                        {item.label}
                      </Caption1>
                      <Body1
                        className={
                          item.label === 'Status' ? styles.statusRunning : styles.essentialValue
                        }
                      >
                        {item.value}
                      </Body1>
                    </div>
                  ))}
                </div>
                <div>
                  {essentialsRight.map((item) => (
                    <div key={item.label} className={styles.essentialRow}>
                      <Caption1 className={styles.essentialLabel}>
                        {item.label}
                      </Caption1>
                      <Body1 className={styles.essentialValue}>{item.value}</Body1>
                    </div>
                  ))}
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
    </FluentProvider>
  );
};

export default ResourceBlade;
