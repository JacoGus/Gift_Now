# GiftNow – O "Ifood" dos Presentes

Transformando a experiência de presentear com rapidez e personalização.

Obs: A Apresentação da solução se encontra no fim deste readme e na pasta PRESENTATION, o video foi cortado por conta da restrição de tamanho do github.

---

## 1. Documentação de Contexto

### Introdução

O **GiftNow** é um aplicativo inovador que visa transformar a experiência de presentear, funcionando como um marketplace que reúne diversas lojas em uma plataforma única e prática. A proposta central é permitir que o usuário escolha presentes de categorias variadas e os envie para qualquer localidade de forma rápida e conveniente.

### Problema

A dificuldade de encontrar o presente ideal rapidamente e a logística complexa para enviá-lo no mesmo dia, muitas vezes impedindo que as pessoas se façam presentes em datas especiais.

### Objetivos

O grande diferencial do GiftNow reside na **entrega expressa**.

---

## 2. Especificação do Projeto

### Requisitos Funcionais

* **Marketplace Multi-lojas**: Catálogo unificado com categorias (flores, chocolates, eletrônicos, roupas).
* **Personalização do Presente**: Opção para anexar mensagens de texto, vídeos curtos e cartões virtuais.
* **Geolocalização**: Identificação de lojas próximas ao endereço do destinatário para otimizar a entrega.
* **Recomendações Inteligentes**: Sugestões baseadas em datas comemorativas e histórico de compras.
* **Notificações Personalizadas**: Lembretes de aniversários e datas importantes.
* **Sistema de Avaliações**: Feedback sobre produtos e lojas para garantir confiança.

### Visão de Futuro

* Integração com redes sociais para importação automática de datas.
* Expansão para presentes digitais (vouchers e ingressos).

---

## 3. Projeto de Interface

### Fluxo do Usuário - Versao final 

* **Home**: Vitrine com destaques e "Sugestões para Hoje".
* **Busca/Categorias**: Filtro por tipo de presente ou ocasião. 
* **Produto**: Detalhes, seleção de embalagem e upload de mensagem/vídeo.
* **Carrinho/Checkout**: Agendamento da entrega (imediata ou data futura) e pagamento.
* **Rastreamento**: Acompanhamento do entregador em tempo real.


---

## 4. Metodologia

O desenvolvimento segue metodologias ágeis, focando em entregas incrementais:

* **Gestão de Tarefas**: Trello.
* **Versionamento**: Git e GitHub.
* **Design**: Figma para prototipagem.

---

## 5. Arquitetura da Solução

### Estrutura

A solução é composta por:

* **Frontend Mobile**: Aplicativo para o usuário final desenvolvido em React Native.
* **Banco de Dados**: **Firebase Firestore** para armazenamento em tempo real de informações de produtos, lojas, pedidos e histórico.

### Tecnologias Chave

* **Firebase Storage**: Serviço essencial para o armazenamento seguro e eficiente das mídias personalizadas (vídeos e imagens) anexadas aos presentes.

---

## 6. Template padrão do Site

O projeto conta com uma Landing Page para captação de lojistas parceiros, seguindo a identidade visual do app.

---

## 7. Programação de Funcionalidades

### Futuros módulos:

* **Algoritmo de Recomendação**: Lógica que cruza a data atual com o perfil do usuário para sugerir produtos, utilizando dados de histórico armazenados no **Firestore**.
* **Cálculo de Frete/Tempo**: Uso da geolocalização para estimar o tempo de entrega com base na distância Loja -> Destinatário.
* **Upload de Mídia**: Funcionalidade para envio e **armazenamento seguro dos vídeos/mensagens personalizadas, utilizando o Firebase Storage**.

---

## 8. Plano de Testes de Software

### Casos de Teste Principais

* **Lojas**: Verificar lojas via Firebase Auth**.
* **Fluxo de Compra**: Adicionar item, personalizar, pagar e finalizar.


---

## 9. Registro de Testes de Software

**Resultados dos testes executados:**

* Teste 01 (Login): Sucesso.
* Teste 02 (formas de pagamento): Sucesso (Correção aplicada no cálculo do frete).
* Teste 03 (Meus pedidos): Sucesso (**Upload para Firebase Storage de até 15mb validado**).

---

## 10. Plano de Testes de Usabilidade

**Objetivo**: Avaliar a facilidade do usuário em encontrar um presente para uma ocasião específica em menos de 3 minutos.

**Público**: 5 usuários com idades entre 20 e 40 anos.

**Tarefas**: "Encontre um buquê de flores para entrega hoje e anexe um cartão."

---

## 11. Registro de Testes de Usabilidade

* **Feedback Geral**: A interface foi considerada intuitiva.
* **Conclusão**: O fluxo principal foi validado com taxa de sucesso de 90%.

---

## 12. Apresentação do Projeto

O GiftNow se posiciona não apenas como um e-commerce, mas como um facilitador de conexões emocionais, resolvendo a dor de quem quer presentear mas não tem tempo a perder.

---

## 13. Referências

* Modelos de negócio de Marketplace (Uber Eats, Ifood).
* Estudos sobre UX para E-commerce Mobile.
* Documentação das APIs de Geolocalização.

---

## 14. Código Fonte

Todo o código fonte do projeto encontra-se organizado nas pastas deste repositório:

* `/src`: Código fonte da aplicação.

---




