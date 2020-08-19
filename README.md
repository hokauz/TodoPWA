# Todo PWA - Ionic

Este é app de exercício usando ionic, angular, @angular/pwa e firebase, para criação de um app todo simples.

## App Demo

Para demonstração foi usado o firebase hosting por possuir https default.

[Acesse a demo aqui](https:'https://todo-pwa-hokauz.web.app')

### Recursos

1. CRUD TODO
2. Utilização offlinse
3. Sincronização de dados com rede disponível
4. Resgate de localização (cidade) via api
5. Push notification
6. Verificação de atualizações

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

Os artefatos de saída estarão na pasta ./www, basta adicionar este conteúdo a um servidor com ssl.

### Considerações futuras

Para fins de continuar este estudo, ainda serão implementadas

1. Forma de sincronização com background sync
2. Melhor uso do indexedDB
3. Melhor verificação de erros e calls de acordo com o suporte do Browser
4. Melhoria da usabilidade
5. Adição de melhores icones
6. Substituíção da API TODO

OBS: Troca de api TODO.

Até o momento foi utilizada a API GO do projeto [TODOBackend](http://todobackend.com) que é bastante útil para
um estudo inicial, mas conforme avançamos em PWA vemos que o backend precisa estar apto a trabalhar
com sincronização da melhor forma possível.
