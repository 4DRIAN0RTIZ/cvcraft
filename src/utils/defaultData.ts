import type { CvData, SectionTitles, ColorScheme } from '../types/cv';
import { nanoid } from 'nanoid';

const id = () => nanoid(8);

export const DEFAULT_SECTION_TITLES: SectionTitles = {
  education: 'Educacion',
  technicalSkills: 'Habilidades Tecnicas',
  personalSkills: 'Habilidades Personales',
  interests: 'Intereses',
  summary: 'Resumen Profesional',
  workExperience: 'Experiencia Laboral',
  projects: 'Proyectos Destacados',
  certifications: 'Certificaciones',
};

export const DEFAULT_COLOR_SCHEME: ColorScheme = {
  headerBg: '#1a1a1a',
  headerText: '#ffffff',
  sidebarBg: '#fafafa',
  accentColor: '#333333',
  textColor: '#1a1a1a',
  borderColor: '#e0e0e0',
};

export const defaultData: CvData = {
  fullName: 'Oscar Adrian Ortiz Bustos',
  professionalTitle: 'Ingeniero en Desarrollo y Gestion de Software',
  photoUrl: 'https://developer.cuevaneander.tech/images/profile2.png',
  photoSize: 160,
  sectionTitles: { ...DEFAULT_SECTION_TITLES },
  colorScheme: { ...DEFAULT_COLOR_SCHEME },
  dateFormat: 'raw',
  contactItems: [
    { id: id(), icon: 'fas fa-envelope', text: 'correo@hotmail.com' },
    { id: id(), icon: 'fas fa-map-marker-alt', text: 'Guadalajara, Jalisco, Mexico' },
    { id: id(), icon: 'fas fa-phone', text: '+52 3344332211' },
    { id: id(), icon: 'fab fa-linkedin', text: 'linkedin.com/in/4drian0rtiz' },
  ],
  education: [
    { id: id(), title: 'Ingenieria en Gestion y Desarrollo de Software', school: 'Universidad Tecnologica de Jalisco', date: '2025' },
    { id: id(), title: 'Bachillerato en Informatica', school: 'Colegio de Bachilleres de Jalisco', date: '2017' },
  ],
  technicalSkills: [
    'Linux (Debian, Ubuntu)', 'HTML, CSS, JavaScript', 'Angular, Laravel, MEAN',
    'PHP, Python', 'SQL, MongoDB', 'Docker', 'Git & GitHub',
    'Bash Scripting', 'NGINX, Gunicorn', 'IA & LLMs', 'REST APIs', 'Neovim Plugins',
  ],
  personalSkills: [
    'Trabajo en equipo', 'Pensamiento analitico', 'Resolucion de problemas',
    'Comunicacion efectiva', 'Adaptabilidad', 'Autoaprendizaje', 'Liderazgo',
  ],
  interests: [
    'Nuevas herramientas de programacion', 'Inteligencia Artificial',
    'Open Source', 'Escritura de articulos tech', 'Astronomia', 'Composicion musical',
  ],
  summary: 'Ingeniero en Gestion y Desarrollo de Software con solidas habilidades en desarrollo Full-Stack y una pasion por la tecnologia Open Source. Experiencia demostrada en el desarrollo de soluciones web, implementacion de APIs, automatizacion de procesos y despliegue de aplicaciones con tecnologias modernas. Especializado en Python, PHP, JavaScript y frameworks como Angular y Laravel. Con experiencia en la implementacion de asistentes inteligentes locales utilizando LLMs, RAG y tecnicas de IA aplicada. Busco constantemente nuevos desafios que me permitan expandir mis conocimientos y contribuir con soluciones innovadoras.',
  workExperience: [
    {
      id: id(), title: 'Ingeniero Desarrollo Master', company: 'Ditra', date: 'Enero 2026 - Actualidad',
      achievements: [
        'Desarrollo de panel de gestion con Laravel/Filament',
        'Creacion de modulos para Ansible en Python',
        'Mantenimiento y desarrollo de Playbooks',
        'Administracion de servidores/hosts en AWX',
      ],
    },
    {
      id: id(), title: 'Desarrollador de Software', company: 'En-trega', date: 'Julio 2024 - Octubre 2025',
      achievements: [
        'Desarrollo de modulos ERP utilizando PHP',
        'Creacion de reportes periodicos y dashboards',
        'Automatizacion de campanas internas de phishing para el personal',
        'Desarrollo de APIs para sistemas de facturacion de clientes',
        'Mantenimiento de modulos y optimizacion de codigo',
        'Diseno e implementacion de un Asistente Inteligente local usando Python, NGINX y Gunicorn',
      ],
    },
    {
      id: id(), title: 'Tecnico en sistemas informaticos', company: 'MFA', date: 'Septiembre 2023 - Julio 2024',
      achievements: [
        'Cableado estructurado e instalacion de camaras CCTV',
        'Configuracion de impresoras de red y soporte tecnico a usuarios',
        'Mantenimiento de sistemas, hardware y bases de datos SQL',
        'Desarrollo de modulos internos del ERP en PHP',
        'Automatizacion de procesos internos usando Python',
        'Creacion de herramienta de comparacion de precios mediante web scraping',
      ],
    },
    {
      id: id(), title: 'Desarrollador de IA Generativa (Estadia Profesional)', company: 'Urrea', date: 'Mayo 2023 - Agosto 2023',
      achievements: [
        'Entrenamiento de modelo de lenguaje con datos empresariales para chatbot de ventas',
        'Desarrollo de interfaz de usuario con Flask',
        'Construccion y despliegue de API en VPS de Hostinger',
        'Configuracion de servidor NGINX para despliegue de API',
        'Gestion del servidor via SSH, permisos y administracion de logs',
        'Creacion de reportes de ventas con Power BI',
      ],
    },
    {
      id: id(), title: 'Asistente de Mantenimiento', company: 'Museo de Cera Guadalajara', date: 'Enero 2021 - Junio 2022',
      achievements: [
        'Mantenimiento preventivo y correctivo de equipos e instalaciones',
        'Colaboracion en medidas de seguridad y emergencia',
        'Atencion al cliente y manejo de consultas de visitantes',
      ],
    },
    {
      id: id(), title: 'Representante de Servicio al Cliente', company: 'Alorica (Amazon Account)', date: 'Abril 2018 - Diciembre 2020',
      achievements: [
        'Atencion a consultas de clientes de Amazon via email y telefono en ingles',
        'Asistencia a repartidores y resolucion eficiente de problemas',
        'Gestion simultanea de multiples solicitudes con precision',
      ],
    },
  ],
  projects: [
    {
      id: id(), title: 'Asistente Inteligente Local',
      details: [
        'Diseno e implementacion de asistente IA integrado con el ERP de En-trega',
        'Backend desarrollado en Python (Flask)',
        'Uso de Llama.cpp/Ollama para inferencia local de LLMs',
        'Integracion de LlamaIndex y RAG para respuestas contextuales',
        'Despliegue en servidor Ubuntu 24.04 con NGINX y Gunicorn',
      ],
    },
    {
      id: id(), title: 'API REST de Facturacion',
      details: [
        'Creacion de API REST usando Slim PHP y Flask Python',
        'Implementacion de autenticacion JWT',
        'Catalogo de errores con soluciones potenciales',
        'Arquitectura orientada a la reutilizacion de componentes',
      ],
    },
    {
      id: id(), title: 'Chatbot con Tecnologia ChatGPT',
      details: [
        'Desarrollo de chatbot para departamento de ventas de Urrea',
        'Entrenamiento de LLM con datos empresariales',
        'API Flask desplegada en VPS Ubuntu 22.04 con NGINX y Gunicorn',
        'Interfaz web con HTML, CSS y JavaScript',
      ],
    },
    {
      id: id(), title: 'Dashboard Administrativo Netline',
      details: [
        'Dashboard privado usando Angular (Frontend) y ExpressJS (Backend)',
        'Gestion integral de operaciones administrativas',
      ],
    },
    {
      id: id(), title: 'Gestor de Emails en Terminal',
      details: [
        'Aplicacion de terminal para gestion de emails',
        'Libreta de contactos para seleccion de destinatarios',
        'Soporte SMTP y adjuntos usando Python',
        'Despliegue en Ubuntu 22.04 con NGINX y Gunicorn',
      ],
    },
  ],
  certifications: [
    {
      id: id(), title: 'Desarrollo de Software',
      items: [
        { id: id(), name: 'Ingenieria en Gestion y Desarrollo de Software - UTJ', year: '2025' },
        { id: id(), name: 'Curso Profesional de React - Codigo Facilito', year: '2025' },
        { id: id(), name: 'Curso Profesional de JavaScript - Codigo Facilito', year: '2023' },
        { id: id(), name: 'Introduccion a R - Codigo Facilito', year: '2023' },
      ],
    },
    {
      id: id(), title: 'Inteligencia Artificial',
      items: [
        { id: id(), name: 'AI Essentials - Google (Coursera)', year: '2025' },
        { id: id(), name: 'ICP Developer - ICP Mexico', year: '2025' },
        { id: id(), name: 'ICP Developer - Zona Tres', year: '2025' },
      ],
    },
    {
      id: id(), title: 'Ciberseguridad',
      items: [
        { id: id(), name: 'Security Operations Fundamentals - Palo Alto Networks', year: '2025' },
        { id: id(), name: 'Introduction to Cybersecurity - Cisco NETACAD', year: '2024' },
        { id: id(), name: 'Cybersecurity Essentials - Cisco NETACAD', year: '2022' },
      ],
    },
  ],
};
