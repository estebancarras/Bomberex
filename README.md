# Bomberex App 1

Este proyecto es una aplicación Ionic con integración a Firebase Firestore. A continuación se detallan las instrucciones para configurar y ejecutar el proyecto en el equipo de un compañero de trabajo.

git config --global user.email "geo.ulloa@duocuc.c"
  git config --global user.name "GeovannyUlloa"

## Requisitos previos

- Node.js (versión recomendada 16.x o superior)
- npm (viene con Node.js)
- Ionic CLI
- Angular CLI (opcional, pero recomendado)

## Instalación de herramientas

1. Instalar Node.js desde [https://nodejs.org/](https://nodejs.org/)

2. Verificar instalación de Node.js y npm:

```bash
node -v
npm -v
```

3. Instalar Ionic CLI globalmente:

```bash
npm install -g @ionic/cli
```

4. (Opcional) Instalar Angular CLI globalmente:

```bash
npm install -g @angular/cli
```

## Clonar el repositorio

Clonar el repositorio del proyecto en la ubicación deseada:

```bash
git clone <URL_DEL_REPOSITORIO>
cd bomberex
```

## Instalación de dependencias

Dentro de la carpeta del proyecto, ejecutar:

```bash
npm install
```

Esto instalará todas las dependencias necesarias, incluyendo Ionic y Firebase.

## Instalación de Firebase en el proyecto

Para usar Firebase en el proyecto, es necesario instalar los paquetes de AngularFire y Firebase:

```bash
npm install firebase @angular/fire
```

## Configuración de Firebase

El proyecto utiliza Firebase Firestore. La configuración de Firebase está en el archivo `src/main.ts`. Asegúrate de que la configuración sea correcta para el proyecto Firebase que se va a usar.

Si es necesario, crea un proyecto en [Firebase Console](https://console.firebase.google.com/) y actualiza la configuración en `src/main.ts` con los datos de tu proyecto.

## Ejecutar la aplicación

Para iniciar el servidor de desarrollo y abrir la aplicación en el navegador, ejecutar:

```bash
ionic serve
```

Esto compilará la aplicación y abrirá una ventana del navegador en `http://localhost:8100`.

## Notas adicionales

- Para usar funcionalidades de Firebase, asegúrate de que el proyecto Firebase tenga habilitados los servicios necesarios (Firestore, Authentication, etc.).
- Si se agregan nuevos iconos de Ionicons, recuerda registrarlos en `src/main.ts` usando `addIcons`.
- Para cualquier problema con dependencias o compilación, intenta eliminar la carpeta `node_modules` y el archivo `package-lock.json` y luego ejecutar `npm install` nuevamente.

## Contacto

Para dudas o problemas, contactar al desarrollador principal.

---

Este README proporciona los pasos básicos para que un nuevo desarrollador pueda configurar y ejecutar el proyecto en su máquina local.
