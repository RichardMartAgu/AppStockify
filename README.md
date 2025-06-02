# Manual: Despliegue de aplicación Ionic (Web y APK Android) con Docker y Android Studio en EC2 (AWS)

## Índice

- [Despliegue Web con Docker o Nginx en EC2](#despliegue-web-con-docker-o-nginx-en-ec2)
- [Generar APK Android con Android Studio](#generar-apk-android-con-android-studio)

# Despliegue Web con Docker o Nginx en EC2


## Requisitos previos

- Cuenta de AWS
- Par de claves para acceder por SSH
- Código fuente de tu app Ionic en GitHub o comprimido
- Android Studio instalado para generar APK
- Conocimiento básico de Linux/terminal
- Docker y Docker Compose instalados en tu instancia EC2

---

## Paso 1: Crear una instancia EC2 en AWS

1. Accede a AWS EC2  
2. Clic en **Launch Instance**  
3. Elige una imagen:  
   Recomendado: Ubuntu Server 22.04 LTS  
4. Tipo de instancia:  
   Recomendado: t2.micro (capa gratuita)  
5. Par de claves:  
   Selecciona uno existente o crea uno nuevo  
6. Configura grupo de seguridad:  
   Permitir puertos 22 (SSH), 80 y 443 (HTTP y HTTPS para la web)  
7. Lanzar la instancia  

![image](https://github.com/user-attachments/assets/ade07c4f-1ed8-4033-afad-25044761d03d)


## Paso 1.1: Reservar y asociar Elastic IP (IP fija pública)

1. En AWS EC2, ve a **Elastic IPs** (Network & Security).  
2. Haz clic en **Allocate Elastic IP address** y confirma.  
3. Selecciona la IP creada → **Actions → Associate Elastic IP address**.  
4. En **Resource type**, selecciona **Instance**.  
5. Elige tu instancia EC2.  
6. En **Private IP address**, selecciona la IP privada (normalmente la única).  
7. Haz clic en **Associate**.  

![image](https://github.com/user-attachments/assets/360b757d-22a3-4621-814b-c7a4a6978647)


## Paso 2: Conectarse a la instancia EC2 por SSH

```bash
ssh -i <nombre del archivo clave> <DNS público proporcionado por AWS>
ssh -i "Stockify.pem" ubuntu@ec2-107-22-235-180.compute-1.amazonaws.com
````

![image](https://github.com/user-attachments/assets/0a701ba8-156e-4170-a3ca-b11baa739ca9)

![image](https://github.com/user-attachments/assets/3d7b5391-6cc0-4b7a-a0b4-b7ed0b971eb6)

# Opción A: Servir app Ionic con Nginx nativo (con DockerFile)

## Paso 3: Creamos una carpeta y clonamos tu API desde GitHub
```bash
git clone https://github.com/usuario/mi-api.git
cd mi-api
```

## Paso 4: Construir la imagen Docker
```bash
docker build -t mi-app-ionic .
```

## Paso 5: Ejecutar el contenedor
```bash
docker run -d -p 80:80 --name ionic-web mi-app-ionic
docker run -d -p 80:80 --name ionic-web mi-app-ionic
```

## Sugerencia adicional: Para verificar que los contenedores estén funcionando
```bash
docker ps
```

# Opción B: Servir app Ionic con Nginx nativo (sin DockerFile)

## Paso 6: Instalar Nginx

```bash
sudo apt update
sudo apt install nginx -y
```

## Paso 7. Construye tu app Ionic localmente (en tu máquina)
```bash
cd ruta/a/tu/app-ionic
npm install
ionic build --prod
```
## Paso 8: Copiar archivos generados a la instancia EC2
```bash

scp -i "tu_clave.pem" -r www/* ubuntu@<IP_ELÁSTICA>:/home/ubuntu/ionic-app
```


## Paso 9. Mueve los archivos al directorio de Nginx 
```bash
docker cp ./www/. stockify_web:/usr/share/nginx/html/
```

## Paso 10: Configurar Nginx para soporte de rutas (Angular/Ionic) y reiniciarlo
```bash
sudo nano /etc/nginx/sites-available/default
```
```bash
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html index.htm;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```
```bash
sudo systemctl restart nginx

```

## Paso 11: Acceder a tu aplicación Ionic (modo web)

```bash
http://<TU_ELASTIC_IP>
http://107.22.235.180/
```

![image](https://github.com/user-attachments/assets/996c2850-f9af-426b-8029-83a179266380)

---


# Generar APK Android con Android Studio

## Paso 12: Instalar dependencias nativas
Asegúrate de tener instalado:

- Node.js

- Java JDK 17+

- Android Studio

- Gradle (Android Studio ya lo incluye normalmente)

- Ionic CLI y Capacitor

```bash
npm install -g @ionic/cli
```

##  Paso 13: Preparar el proyecto Ionic para Android

```bash
ionic build --prod
npx cap add android
npx cap copy
```

##  Paso 14: Abrir el proyecto en Android Studio

```bash
npx cap open android
```

## Paso 15: Generar el APK en Android Studio

1. Ve al menú superior: `Build > Build Bundle(s) / APK(s) > Build APK(s)`
2. Espera a que finalice la compilación.
3. Verás un enlace para abrir la carpeta donde se encuentra el APK generado.

## Paso 16: Copia la APK en tu móvil e instálala


