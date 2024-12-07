FROM node:20-bookworm-slim
RUN apt-get update
RUN apt-get install -y \
  git \
  sudo \
  nano

ARG UID=1000
ARG GID=1000
ARG USERNAME='node'

USER root
RUN mkdir /workspace && \
  chown ${USERNAME}:${USERNAME} /workspace

RUN echo "${USERNAME} ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers

USER ${NEW_USERNAME}
