import React from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Switch
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Backup as BackupIcon,
  Language as LanguageIcon
} from '@mui/icons-material';

const Settings: React.FC = () => {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Configurações
      </Typography>

      <Paper sx={{ mt: 3 }}>
        <List>
          <ListItem>
            <ListItemIcon>
              <NotificationsIcon />
            </ListItemIcon>
            <ListItemText
              primary="Notificações"
              secondary="Configurar alertas e notificações do sistema"
            />
            <Switch edge="end" />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemIcon>
              <SecurityIcon />
            </ListItemIcon>
            <ListItemText
              primary="Segurança"
              secondary="Configurações de segurança e privacidade"
            />
            <Switch edge="end" />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemIcon>
              <BackupIcon />
            </ListItemIcon>
            <ListItemText
              primary="Backup"
              secondary="Configurar backup automático dos dados"
            />
            <Switch edge="end" />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemIcon>
              <LanguageIcon />
            </ListItemIcon>
            <ListItemText
              primary="Idioma"
              secondary="Português (Brasil)"
            />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

export default Settings; 