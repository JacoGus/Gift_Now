# 1. Documentação de Contexto (GiftNow)

## 1.1 Introdução

O **GiftNow** é um aplicativo mobile inovador (desenvolvido em React Native) que se estabelece como um *marketplace* de presentes digitais e físicos. Sua missão é simplificar e transformar a experiência de presentear, funcionando como uma plataforma unificada que conecta usuários a diversas lojas parceiras.

O projeto utiliza o ecossistema **Firebase** (Firestore, Storage e Authentication) como sua principal arquitetura de backend, garantindo escalabilidade, gerenciamento de dados em tempo real e segurança na autenticação de usuários e lojistas.

## 1.2 Problema (The Pain Point)

O projeto visa solucionar a dificuldade significativa dos consumidores em encontrar o presente ideal de forma rápida e eficiente em meio a um leque de opções fragmentadas. Mais criticamente, ele aborda a complexidade da **logística de entrega expressa**, que impede muitas vezes que o usuário envie um presente físico no mesmo dia, falhando em se fazer presente em celebrações de última hora.

## 1.3 Solução Proposta

O GiftNow oferece uma solução completa e ágil, focada na combinação de tecnologia e conveniência:

* **Marketplace Unificado:** Criação de um catálogo multi-lojas e multi-categoria (flores, chocolates, eletrônicos, etc.) em uma única interface.
* **Entrega Expressa e Geolocalização:** O sistema utiliza geolocalização para identificar lojas próximas ao endereço do destinatário, otimizando o tempo de entrega e garantindo o diferencial da entrega no mesmo dia.
* **Personalização Emocional:** Permite que o usuário personalize o presente com mídias digitais, incluindo mensagens de texto, cartões virtuais e o **upload de vídeos curtos**, que são armazenados de forma segura no **Firebase Storage**.

## 1.4 Objetivos e Diferenciais

O objetivo principal do GiftNow é se posicionar como o facilitador de conexões emocionais mais rápido do mercado. Os diferenciais-chave são:

* **Entrega Expressa (Core):** É o objetivo central do projeto, garantir que presentes possam ser enviados e recebidos no mesmo dia.
* **Recomendações Inteligentes:** Utiliza um algoritmo que sugere presentes com base em datas comemorativas, histórico de compras e perfil do usuário, com dados gerenciados pelo **Firestore**.
* **Segurança e Confiança:** Oferece um sistema de avaliações robusto e utiliza o **Firebase Authentication** para login seguro, elevando a confiança na plataforma.
* **Usabilidade (UX):** Manter o fluxo de compra simples e intuitivo, desde a busca até o rastreamento em tempo real.
