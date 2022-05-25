# N2 B2 Serviços De Rede - Docker Services Orchestrator

Componentes do projeto:

- Interface do usuário em `Angular`.
- BFF em `Nodejs` que se comunica com o Docker através de sua API, permitindo a orquestração dos containers.
- Toda infraestrutura está hospedada no provedor de nuvem `AWS`.
- 2 Servidores, sendo que:
  - Um serve o projeto(front+back) para orquestrar os containers.
  - Outro hospeda os containers docker. 
- As métricas da máquina que hospeda os containers são coletadas pelo `Prometheus` e apresentada ao usuário através do `Grafana`.

## Interface :earth_americas:

- **https://containers.cheguei.app/** :warning: desligamos os servidores ⚠️

<p align="center">
  <a href="./docs/login.png">
    <img alt="Made by Christian Seki" src="./docs/login.png" width="450px">
  </a>
</p>

<p align="center">
  <a href="./docs/images.jpeg">
    <img alt="Made by Christian Seki" src="./docs/images.jpeg" width="450px">
  </a>
</p>

<p align="center">
  <a href="./docs/containers.jpeg">
    <img alt="Made by Christian Seki" src="./docs/containers.jpeg" width="450px">
  </a>
</p>

<p align="center">
  <a href="./docs/dashboards.jpeg">
    <img alt="Made by Christian Seki" src="./docs/dashboards.jpeg" width="450px">
  </a>
</p>

## Infraestrutura em Cloud :scroll:

### Arquitetura

<p align="center">
  <a href="./docs/architecture.png">
    <img alt="Made by Christian Seki" src="./docs/architecture.png" width="450px">
  </a>
</p>

### Suspended :fearful:

<p align="center">
  <a href="./docs/suspended.png">
    <img alt="Made by Christian Seki" src="./docs/suspended.png" width="450px">
  </a>
</p>
