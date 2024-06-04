# PROYECTO MVC ORDINARIO JS (EXPRESS y CONEXIÓN CON MySQL2)

## APP WEB DE GESTIÓN DE COLECCIONES DE OBJETOS "(PRODUCTOS)"

## - Instrucciones -
Para usar la app, hay que hacer ciertas configuraciones en la base de datos de mysql y requiere ciertas dependencias para ser usado.
### Dependencias utilizadas en el proyecto por node.js:
* __1.- axios__
* __2.- bcrypt__
* __3.- buffer__
* __4.- connect-flash__
* __5.- cookie-parser__
* __6.- dotenv__
* __7.- express__
* __8.- express-session__
* __9.- jsonwebtoken__
* __10.- mysql2__
* __11.- passport__
* __12.- passport-local__
* __13.- pug__
* __14.- sass__
* __15.- multer__
* __16.- sharp__
* __17.- node-cache__

Para usar todas estas dependencias en nuestro dispositivo, ejecute en la terminal estando ubicado la ruta principal del archivo:
- _`npm install`_
> Este proceso asegura que todas las dependencias necesarias para ejecutar este proyecto se instalen correctamente en el nuevo entorno de trabajo con las versiones utilizadas en el package.json.

### Ejemplo de la consola VS Code
![Ejemplo_install_npm](https://github.com/JoseCob/Proyecto_Ordinario/assets/157552935/77ddbac8-8560-4b96-9189-766d897d6362)


### *INSTALACIÓN MANUAL
Para hacer la instalación de cada una de las dependencias ejecute lo siguiente en la terminal, una vez estando ubicado en la ruta del proyecto y habiendo instalado el package.json:
- _`npm install (dependencia) -E`_
> El "-E" nos ayudara en instalar versiones exactas del proyecto en el que se esta usando o requiriendo de la dependencia, para evitar una actualización automática de una dependencia.
Que se traduce como: **`npm install bcrypt -E`**
Una vez ya habiendo hecho la instalacion.
Primeramente procedemos a configurar el servidor de MySQL.

### - CONFIGURACIÓN DEL SERVER -
Ruta donde pueden encontrar el servidor de MySQL en el sistema operativo windows 10 / 11.
- _`C:\ProgramData\MySQL\MySQL Server 8.0`_
>En la siguiente Ruta encontraras la ubicación del servidor de mysql.

### - POSTERIORMENTE -
Ejecuta con un block de notas u otro editor de texto de tu preferencia para configurar el archivo my.ini que contiene la configuración del servidor. Una vez dentro del archivo, busca esta propiedad: 
- _`max_allowed_packet=64M`_ 
> verifica que tenga establecido 64M, en caso de que el valor sea memos, 
es posible que el servidor no pueda almacenar una gran cantidad de informacion o datos, esto sera util por si trabajamos con archivos o datos de gran magnitud de almacenamiento.
Una vez realizado la configuracion, ya podemos almacenar datos equivalentes a 64M en la base de datos de MySQL.
En este caso es necesario configurar el server, porque vamos almacenar imagenes en formato **LONGBLOB**, donde este se encargara de registrar las imagenes en forma de datos.
Por lo que, la imagen puede llegar a sobrepasar mas de 1M de almacenamiento en la base de datos, esto lo hacemos para garantizar que el dato transformado por longblob se registre correctamente en la base de datos por si aun no se a configurado.

### Ejemplo de la configuracion del server
![config_server](https://github.com/JoseCob/Proyecto_Ordinario/assets/157552935/393bbbe6-5c38-4f90-b915-37db8cbb382e)

### Dependencia multer
La app, utilizo la siguiente dependencia, para manejar uploads la cual, se utiliza para recibir archivos enviados en solicitudes HTTP 'POST' que contienen datos de formulario multipart/form-data, en pocas palabras "IMAGENES"
- `Dependencia instalada = multer`
> Ejecuta el siguiente comando en la terminal con el directorio de la app, para una correcta instalacion exacta de la dependencia:
- _`npm install multer -E`_

### Dependencia sharp
**Instalacion del sharp:**
- _`npm install sharp -E`_
> Se utilizo la dependencia sharp, la cual se utiliza para procesar imágenes de alto rendimiento o calidad.
Permitiendo redimensionar, convertir y manipular imágenes en varios formatos.
Es especialmente útil para optimizar imágenes antes de almacenarlas o mostrarlas en una aplicación web.

### Dependencia node-cache
**Instalacion del node-cache:**
- _`npm install node-cache -E`_
> Se utilizo la dependencia node-cache, la cual se utiliza para el rendimiento de la aplicación. Es un mecanismo eficiente para almacenar y acceder a datos en la memoria.
> Esto fue útil especialmente cuando necesitamos acceder a los mismos datos de forma repetida en un corto período de tiempo o cuando deseas evitar realizar operaciones costosas para obtener los datos y evitar los tiempos de carga demaciadas largas en la app.

## Configuración del env
Para utilizar la Base de datos de la app, se necesita configurar el .env de la app con base a las propiedas del servidor de mysql del usuario que va a utilizar nuestra app.

### Imagen de ejemplo donde puedes ver la instancia local de tu localhost en _`mysql Workbench`_

![session_instanciaLocal](https://github.com/JoseCob/Proyecto_Ordinario/assets/157552935/f79b5220-21ae-49f8-ba54-6bf4561c71cc)

### Configuracion para establecer las variables de entorno desde el .env y acceder a la instancia de conexión con el mysql:

1.  _`SESSION_SECRET = collectionManager`_ **(Aqui va la clave que quieras utilziar, la puedes dejar asi o modificarlo)**
2.  _`DB_HOST = localhost`_ **(Recomendado, Tiene que ser de tipo localhost ya que se ejecuta la app en entorno local)**
3.  _`DB_USER = root`_ **(Si tienes un usario destinado selecciona tu usuario, o usa el predeterminado 'root', esto dependera de la manera en como entras en la instancia local de MySQL)**
4.  _`DB_PASSWORD = `_ **(Si usas contraseña para entrar al as instancias local de MySQL, debes agregarlo, si usas un servidor web como lo es el caso del software xampp o wamp, generalmente no te pide contraseña para entrar a la instancia)**
5.  _`DB_NAME = prodmanagement`_ **(Utiliza el nombre de la base de datos creada en MySQL en mi caso se mantiene como esta)**
6.  _`DB_PORT = 3306`_ **(Selecciona el puerto de conexión que utilizas para entrar a la instancia local de MySQL)**
7.  _`PASSWORD_SALT_ROUNDS = 10`_ **(Recomendado dejar en 10, esto es para el sal de rondas para las contraseñas hash al registrar usuarios)**

> Una vez configurado el .env, ya puedes proceder a utilizar la app libremente con las configuraciones correspondientes y la base de datos a utilizar, en este caso el nombre de la BD del proyecto es 'prodmanagement'.

### Imagen de Ejemplo del .env
![image](https://github.com/JoseCob/Proyecto_Ordinario/assets/157552935/d54029db-bfe8-4563-aaf8-e4947e92f4da)

### Para poder ejecutar el proyecto
escribe lo siguiente en consola estando en la ruta del proyecto:
- _`npm start`_

> Con dicho comando se ejecuta o compila el main del proyecto, llamado **`server.js`** Ubicado en el package.json
### Ejemplo de compilación en terminal
![Ejemplo_terminal](https://github.com/JoseCob/Proyecto_Ordinario/assets/157552935/81df6e7d-0f2f-4ce8-a77e-5ec52f2db293)

### Imagen de las dependencias en el package.json
![image](https://github.com/JoseCob/Proyecto_Ordinario/assets/157552935/84eaa0ef-7aca-4d37-93da-17755e8a5a12)

