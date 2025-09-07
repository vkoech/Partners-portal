export const environment = {
  production: true,
  apiUrl: 'http://microservices.sysre.co.ke:8089/api/',
  appName: 'Partners portal',
  version: '1.0.0',
  features: {
    enableNotifications: true,
    enableFileUpload: true,
    enableRealTimeUpdates: true,
    maxFileSize: 50 * 1024 * 1024, // 50MB
    allowedFileTypes: ['pdf', 'png', 'jpg', 'jpeg', 'doc', 'docx']
  },
  api: {
    timeout: 30000,
    retryAttempts: 3
  }
};
