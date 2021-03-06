# Dockerfile for the custom CodeBuild build environment for serpentary2018,
# based on the AWS curated image for Go 1.10, see
# github.com/aws/aws-codebuild-docker-images/blob/master/ubuntu/golang/1.10

FROM ubuntu:14.04.5

ENV DOCKER_BUCKET="download.docker.com" \
    DOCKER_VERSION="17.09.0-ce" \
    DOCKER_CHANNEL="stable" \
    DOCKER_SHA256="a9e90a73c3cdfbf238f148e1ec0eaff5eb181f92f35bdd938fd7dab18e1c4647" \
    DIND_COMMIT="3b5fac462d21ca164b3778647420016315289034" \
    DOCKER_COMPOSE_VERSION="1.16.1"

################################################################################
# Install basic tools.
# TODO: Some of these are probably not required for the build process, so there
# may be potential for size optimization.

RUN    apt-get update \
    && apt-get install -y --no-install-recommends \
         wget=1.15-* python=2.7.5-* python2.7-dev=2.7.6-* fakeroot=1.20-* \
         ca-certificates tar=1.27.1-* gzip=1.6-* zip=3.0-* autoconf=2.69-* \
         automake=1:1.14.1-* bzip2=1.0.6-* file=1:5.14-* g++=4:4.8.2-* \
         gcc=4:4.8.2-* imagemagick=8:6.7.7.10-* libbz2-dev=1.0.6-* \
         libc6-dev=2.19-* libcurl4-openssl-dev=7.35.0-* libdb-dev=1:5.3.21~* \
         libevent-dev=2.0.21-stable-* libffi-dev=3.1~rc1+r3.0.13-* \
         libgeoip-dev=1.6.0-* libglib2.0-dev=2.40.2-* libjpeg-dev=8c-* \
         libkrb5-dev=1.12+dfsg-* liblzma-dev=5.1.1alpha+20120614-* \
         libmagickcore-dev=8:6.7.7.10-* libmagickwand-dev=8:6.7.7.10-* \
         libmysqlclient-dev=5.5.59-* libncurses5-dev=5.9+20140118-* \
         libpng12-dev=1.2.50-* libpq-dev=9.3.22-* libreadline-dev=6.3-* \
         libsqlite3-dev=3.8.2-* libssl-dev=1.0.1f-* libtool=2.4.2-* \
         libwebp-dev=0.4.0-* libxml2-dev=2.9.1+dfsg1-* libxslt1-dev=1.1.28-* \
         libyaml-dev=0.1.4-* make=3.81-* patch=2.7.1-* \
         xz-utils=5.1.1alpha+20120614-* zlib1g-dev=1:1.2.8.dfsg-* unzip=6.0-* \
         curl=7.35.0-* e2fsprogs=1.42.9-* iptables=1.4.21-* \
         xfsprogs=3.1.9ubuntu2 xz-utils=5.1.1alpha+20120614-* \
    && apt-get install -y -qq \
         less=458-* groff=1.22.2-*

################################################################################
# Build git from source with openssl.
# Ubuntu's standard git is built with broken gnutls.

RUN    apt-get -qy build-dep \
         git=1:1.9.1 \
    && apt-get -qy install \
         libcurl4-openssl-dev=7.35.0-* git-man=1:1.9.1-* liberror-perl=0.17-* \
    && mkdir -p /usr/src/git-openssl \
    && cd /usr/src/git-openssl \
    && apt-get source git=1:1.9.1 \
    && cd $(find -mindepth 1 -maxdepth 1 -type d -name "git-*") \
    && sed -i -- 's/libcurl4-gnutls-dev/libcurl4-openssl-dev/' ./debian/control \
    && sed -i -- '/TEST\s*=\s*test/d' ./debian/rules \
    && dpkg-buildpackage -rfakeroot -b \
    && find .. -type f -name "git_*ubuntu*.deb" -exec dpkg -i \{\} \; \
    && rm -rf /usr/src/git-openssl \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

################################################################################
# Install Docker toolset.

RUN    set -x \
    && curl -fSL -o docker.tgz \
         https://${DOCKER_BUCKET}/linux/static/${DOCKER_CHANNEL}/x86_64/docker-${DOCKER_VERSION}.tgz \
    && echo "${DOCKER_SHA256} *docker.tgz" | sha256sum -c - \
    && tar --extract --strip-components 1 \
         --file docker.tgz --directory /usr/local/bin/ \
    && rm docker.tgz \
    && docker -v \
    && addgroup dockremap \
    && useradd -g dockremap dockremap \
    && echo 'dockremap:165536:65536' >> /etc/subuid \
    && echo 'dockremap:165536:65536' >> /etc/subgid \
    && wget -O /usr/local/bin/dind \
         https://raw.githubusercontent.com/docker/docker/${DIND_COMMIT}/hack/dind \
    && curl -L \
         https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-Linux-x86_64 \
         > /usr/local/bin/docker-compose \
    && chmod +x /usr/local/bin/dind /usr/local/bin/docker-compose \
    && docker-compose version

################################################################################
# Install dependencies by all python images equivalent to buildpack-deps:jessie
# on the public repos.
# TODO: May not be necessary after all, check for potential optimization.

RUN    wget https://bootstrap.pypa.io/get-pip.py -O /tmp/get-pip.py \
    && python /tmp/get-pip.py \
    && pip install awscli \
    && rm -fr /var/lib/apt/lists/* /tmp/* /var/tmp/*

VOLUME /var/lib/docker

COPY dockerd-entrypoint.sh /usr/local/bin/

################################################################################
# Install protobuf compiler and make include files available.

RUN    curl -OL \
         https://github.com/google/protobuf/releases/download/v3.5.1/protoc-3.5.1-linux-x86_64.zip \
    && unzip protoc-3.5.1-linux-x86_64.zip -d protoc3 \
    && mv protoc3/bin/* /usr/local/bin/ \
    && mv protoc3/include/* /usr/local/include/

################################################################################
# Install Go environment

ENV GOLANG_VERSION="1.10" \
    GOLANG_DOWNLOAD_SHA256="b5a64335f1490277b585832d1f6c7f8c6c11206cba5cd3f771dcb87b98ad1a33" \
    GOPATH="/go" \
    DEP_VERSION="0.4.1" \
    DEP_BINARY="dep-linux-amd64"

RUN    mkdir -p "$GOPATH/src" "$GOPATH/bin" \
    && chmod -R 777 "$GOPATH" \
    && apt-get install -y --no-install-recommends \
         pkg-config=0.26-* \
    && apt-get clean \
    && wget -O /tmp/golang.tar.gz \
         https://storage.googleapis.com/golang/go$GOLANG_VERSION.linux-amd64.tar.gz \
    && echo "$GOLANG_DOWNLOAD_SHA256 /tmp/golang.tar.gz" | sha256sum -c - \
    && tar -xzf /tmp/golang.tar.gz -C /usr/local \
    && rm -fr /var/lib/apt/lists/* /tmp/* /var/tmp/* \
    && wget -O $GOPATH/bin/dep \
         https://github.com/golang/dep/releases/download/v$DEP_VERSION/$DEP_BINARY \
    && chmod +x $GOPATH/bin/dep

ENV PATH="$GOPATH/bin:/usr/local/go/bin:$PATH"

WORKDIR $GOPATH

RUN    go get -u github.com/golang/lint/golint \
    && go get -u github.com/golang/protobuf/protoc-gen-go

################################################################################
# Install nodejs, npm, and webpack, required for the webapp build process.

ENV NODE_VERSION="8.11.1"

RUN    wget -O nodejs.tar.gz \
         https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.gz \
    && tar -xzf nodejs.tar.gz -C /usr/local --strip-components=1 \
    && rm nodejs.tar.gz \
    && ln -s /usr/local/bin/node /usr/local/bin/nodejs \
    && rm -fr /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN npm install -g webpack@4.4.1 webpack-cli@2.0.13

################################################################################
# Finalize.

ENTRYPOINT ["dockerd-entrypoint.sh"]
