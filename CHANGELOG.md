# Changelog

Todas as mudanças relevantes deste projeto devem ser documentadas aqui.

## 0.2.0 - Início da recriação do app

- Alinhado o nome técnico do pacote para `orcamaster`.
- Substituída a tela mínima por um shell inicial com sidebar, dashboard, KPIs, clientes e orçamentos mockados.
- Adicionados dados de domínio mockados para orientar os próximos módulos sem conectar persistência real.
- Atualizado o título HTML para OrçaMaster.

## 0.1.1 - Auditoria inicial do OrçaMaster

- Reorganizada a documentação técnica em `docs/`.
- Adicionado relatório de auditoria inicial.
- Adicionados roadmap e diretrizes iniciais de design system.
- Atualizado README para refletir o fluxo Issue → Codex → PR → revisão → merge.

## 0.1.0 - Base de recuperação

- Adicionada documentação de arquitetura, modelo de dados e plano de migração.
- Adicionado `.env.example` com variáveis públicas Supabase esperadas.
- Adicionado `.gitignore` para dependências, build e arquivos locais.
- Restaurada estrutura mínima `src/` com React, estilos globais e cálculo de orçamento testado.
