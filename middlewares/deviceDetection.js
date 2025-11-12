/**
 * Middleware para detectar el tipo de dispositivo basado en User-Agent
 * Añade información del dispositivo a req.device
 */
export const detectDevice = (req, res, next) => {
  const userAgent = req.headers['user-agent'] || '';

  // Detectar si es dispositivo móvil
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
  const isMobile = mobileRegex.test(userAgent);

  // Detectar tablet específicamente
  const tabletRegex = /iPad|Android(?!.*Mobile)|Tablet|tablet/i;
  const isTablet = tabletRegex.test(userAgent);

  // Añadir información del dispositivo al request
  req.device = {
    isMobile: isMobile && !isTablet,
    isTablet: isTablet,
    isDesktop: !isMobile && !isTablet,
    userAgent: userAgent,
    // Permisos basados en el dispositivo
    permissions: {
      canCreate: isMobile && !isTablet,
      canEdit: isMobile && !isTablet,
      canDelete: isMobile && !isTablet,
      canView: true // Todos pueden ver
    }
  };

  next();
};

/**
 * Middleware para restringir operaciones solo a dispositivos móviles
 * Debe usarse DESPUÉS de detectDevice
 */
export const requireMobile = (req, res, next) => {
  if (!req.device) {
    return res.status(500).json({
      message: "Error: middleware detectDevice debe ejecutarse primero"
    });
  }

  if (!req.device.isMobile) {
    return res.status(403).json({
      message: "Esta operación solo está permitida desde dispositivos móviles",
      deviceInfo: {
        detected: req.device.isDesktop ? 'desktop' : (req.device.isTablet ? 'tablet' : 'unknown'),
        required: 'mobile'
      }
    });
  }

  next();
};

/**
 * Middleware opcional: permitir override del tipo de dispositivo para testing
 * Ejemplo: ?deviceType=mobile
 */
export const allowDeviceOverride = (req, res, next) => {
  const override = req.query.deviceType;

  if (override && ['mobile', 'tablet', 'desktop'].includes(override)) {
    req.device = {
      isMobile: override === 'mobile',
      isTablet: override === 'tablet',
      isDesktop: override === 'desktop',
      userAgent: req.headers['user-agent'] || '',
      isOverride: true,
      permissions: {
        canCreate: override === 'mobile',
        canEdit: override === 'mobile',
        canDelete: override === 'mobile',
        canView: true
      }
    };
  }

  next();
};
