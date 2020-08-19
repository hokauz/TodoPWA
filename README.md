# Todo PWA - Ionic

Este é app de exercício usando ionic, angular e @angular/pwa, para criação de um app todo simples.

## App Demo

Para demonstração foi usado o firebase hosting por possuir https default.

[Acesse a demo aqui](https:'https://todo-pwa-hokauz.web.app')

### Recursos

1. CRUD TODO
2. Utilização offlinse
3. Sincronização de dados com rede disponível
4. Resgate de localização (cidade) via api
5. Push notification

#### Sobre geolocation

Para utilizar o recurso de geolocalização (resgatar as cidade do usuário) adicione uma chave de api google (geolocation) no arquivo environments/environment.prod.ts,
na propriedade google_api_key.

Caso não seja informada uma chave válida, o app tentará resgatar a cidade através de uma pi utilizando o IPv4 do usuário.

### Build

Para gerar um build com este projeto é preciso ter o ambiente ionic em sua máquina.

Siga estes passos

- npm i -g @ionic/cli;
- npm i
- ionic build --prod

Os artefatos de saída estarão na pasta ./www

### Considerações
