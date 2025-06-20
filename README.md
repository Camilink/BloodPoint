# BloodPoint 🩸

**Sistema de Promoción y Gestión de Donaciones de Sangre**

> Aplicación móvil para la gestión de donaciones de sangre


[![Ionic](https://img.shields.io/badge/Ionic-8.0.0-blue.svg)  ](https://ionicframework.com/)[![Angular](https://img.shields.io/badge/Angular-19.0.0-red.svg)  ](https://angular.io/)[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue.svg)  ](https://www.typescriptlang.org/)[![Capacitor](https://img.shields.io/badge/Capacitor-7.2.0-blue.svg)  ](https://capacitorjs.com/)[![ML Kit](https://img.shields.io/badge/ML%20Kit-7.2.1-green.svg)  ](https://developers.google.com/ml-kit)


## Tabla de Contenidos


-  [Descripción](#descripción)

-  [Características principales](#características-principales)

-  [Para Donantes](#para-donantes)

-  [Para Representantes](#para-representantes)

-  [Stack Tecnológico](#stack-tecnológico)

-  [Requisitos del sistema](#requisitos-del-sistema)

-  [Dispositivo Móvil](#dispositivo-móvil)

-  [Permisos](#permisos)

-  [Instalación y ejecución](#instalación-y-ejecución)

-  [Prerrequisitos](#prerrequisitos)

-  [Clonar e instalar dependencias](#clonar-e-instalar-dependencias)

-  [Iniciar en desarrollo](#iniciar-en-desarrollo)

-  [Build Android](#build-android)

-  [Variables de entorno](#variables-de-entorno)

-  [Estructura del proyecto](#estructura-del-proyecto)

-  [Guía de uso por rol](#guía-de-uso-por-rol)

-  [Donantes](#donantes)

-  [Representantes](#representantes)

-  [Endpoints API](#guía-de-uso-por-rol)

-  [Guía de desarrollo y contribución](#guía-de-desarrollo-y-contribución)

-  [Estándares](#estándares)

-  [Notas adicionales](#notas-adicionales)


------------

  

## Descripción

BloodPoint es una aplicación móvil que conecta donantes de sangre con centros de donación y campañas activas. Diseñada para el contexto chileno, permite la geolocalización de centros, generación de códigos QR para registro rápido, gestión de campañas y asistencia mediante chatbot.

  

## Características principales

### Para Donantes

- Registro con RUT

- Geolocalización y rutas hacia centros

- Código QR personal para registrar donaciones

- Historial completo de donaciones

- Chatbot para dudas frecuentes

  

###Para Representantes

- Autenticación por email

- Gestión de campañas

- Escaneo de códigos QR

- Visualización y validación de donaciones

- Publicación de solicitudes urgentes

------------

  

## Stack Tecnológico

| Componente     | Tecnología                    |
|----------------|-------------------------------|
| Framework      | Angular 19 + Ionic 8          |
| Móvil Híbrido  | Capacitor 7.2                 |
| Lenguaje       | TypeScript 5.6                |
| Mapas          | Mapbox GL JS 3.11.1           |
| Escáner QR     | ML Kit + Capacitor Plugin     |
| Backend API    | REST (Heroku)                 |
| Autenticación  | JWT Token                     |

## Requisitos del sistema

#### Dispositivo Móvil

- Android 6.0 o superior

- Mínimo 2 GB RAM (recomendado 4 GB)

- Conectividad 3G/4G o WiFi

  

#### Permisos

- Cámara (QR)

- Geolocalización

- Internet

  

## Instalación y ejecución

### Prerrequisitos

```bash

npm  install  -g  @ionic/cli  @angular/cli  @capacitor/cli`

```

### Clonar e instalar dependencias

```bash

git  clone  https://github.com/Camilink/BloodPoint.git

cd  BloodPoint

npm  install

```

### Iniciar en desarrollo

```bash

ionic  serve

```

### Build Android

```bash

ionic  build

ionic  capacitor  add  android

ionic  capacitor  open  android

```

### Variables de entorno

```bash

//  src/environments/environment.ts

export  const  environment = {

production:  false,

mapbox:  {

accessToken:  'tk_Mapbox'

}

};

```

### Estructura del proyecto

```bash

src/

├──  app/

│  ├──  pages/  # Vistas y pantallas

│  ├──  services/  # Conexión API, Mapas, Auth

│  ├──  modals/  # Componentes modales

│  ├──  guards/  # Rutas protegidas

│  └──  interfaces/  # Modelos y tipos

├──  assets/

├──  environments/

├──  theme/

└──  app.module.ts

```

### Guía de uso por rol

#### Donantes

- Registro por RUT

- Consulta de centros cercanos

- Navegación con rutas

- Generación de código QR

- Historial de donaciones

#### Representantes

- Acceso por email

- Selección de lugar de donación

- Gestión y validación de campañas

- Escaneo de donaciones

- Solicitudes urgentes

### Guía de uso por rol

>Base URL: https://bloodpoint-core-qa-35c4ecec4a30.herokuapp.com

| Endpoint                        | Método | Descripción                        |
|--------------------------------|--------|------------------------------------|
| /campañas/                     | POST   | Crear campañas (representantes)   |
| /centros/                      | GET    | Obtener centros de donación       |
| /donaciones/registrar-qr/      | POST   | Registrar donación por QR         |
| /ingresar/                     | POST   | Inicio de sesión                   |
| /profile/                      | GET    | Perfil del usuario                 |


### Guía de desarrollo y contribución

1. Fork del repositorio

2. Nueva rama: git checkout -b feature/nueva-funcionalidad

3. Cambios + pruebas locales (ionic serve)

4. Linting (ng lint)

5. Commits descriptivos

6. PR con detalle

------------

### Estándares

- ESLint con reglas Angular

- Convención de carpetas modular

- Documentación con JSDoc

  

### Notas adicionales

- Proyecto desarrollado como parte del proceso de titulación en DUOC UC.

- Optimizado para contexto chileno (validación de RUT, geolocalización centrada en Santiago).

- Compatible con despliegue PWA (limitado).

- Aplicación probada en Android y navegadores Chrome/Brave.
