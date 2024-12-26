Docker: Docker is opensource platform that allows yout to automate the deployment and management of applications within lightweight, isolated software containers.
Docker is a platform that allows developers to package, deploy, and run applications in lightweight, portable containers. Containers bundle an application with its dependencies, ensuring consistency across environments.

Image: A Docker Image is a blueprint for creating containers, containing the application and its dependencies.

Container: A Docker Container is a runtime instance of a Docker Image, including the application and environment specified by the image.

Advantages: Portability: Consistent across environments.
            Isolation: Applications run in separate containers.
            Scalability: Easily scale up or down.
            Faster Deployment: Lightweight containers speed up deployment.

Docker file: A dockerfile is a text file that contains instructions on how to build a Docker image. Key instructions include FROM, RUN, CMD, COPY, WORKDIR, etc.

Volume: Docker volume is a feature provided by Docker that allows you to manage persistent data in Docker containers.
When container is created without volume the data is lost when container is stopped this is overcome by volumes.
Docker volume allows you to create a seperate area that can be shared between containers or between a container and the host system.

Docker-compose: Docker Compose is a tool used for defining and managing multi-container Docker applications. It allows you to describe an application's services, networks, and volumes in a single YAML file (docker-compose.yml) and manage them together as a single unit.

Optimize a Docker image: Use smaller base images (e.g., alpine), Combine RUN commands to minimize layers, Use .dockerignore to exclude unnecessary files.

Troubleshoot a container that won't start: Check container logs: docker logs <container_name>, Inspect container configuration: docker inspect <container_name>, Verify network and dependencies, Check if the required ports are available

Network: Docker networking is a fundamental aspect of Docker that enables communication between Docker containers and external networks. It allows you to connect containers together, as well as connect containers to the host machine and other external resources.
Network drivers:
  bridge: The default network is good for running containers that don't require special networking capabilities. User-defined bridge networks enable containers on the same Docker host to communicate with each other. A user-defined network typically defines an isolated network for multiple containers belonging to common project or component.
  host: Host network shares the host's network with the container. When you use this driver, the container's network isn't isolated from host.
  overlay: Overlay network are best when you need containers running on different Dcoker hosts to communicate, or when multiple applications work together using Swarm services.

limit container resource usage:
memory to limit memory usage, cpus to restrict CPU usage, cpu-shares to prioritize CPU allocation among containers

Bind Mounts: Directly map a host directory or file to the container. Tightly coupled with the host.

Volumes: Managed by Docker, stored in a special location on the host, and provide better portability and isolation.
Volumes are stored in local in /var/lib/docker/volumes/
Docker volumes are used to persist data outside of the container

CMD: Default cmd that will run, can be override when pass command line by 'docker run'
docker run nginx-container bash(this will not run default cmd will run bash)
Entrypoint: main process that always runs, cannot be override when pass command line by 'docker run' it will append

Docker image is storged in docker registry. Docker hub is public registry

COPY: The COPY instruction is used for copying files and directories from the local filesystem (host) into the Docker container.
COPY ./local-file.txt /app/remote-file.txt
This copies local-file.txt from the host system into the /app directory in the container.
It copies files and directories to the container's filesystem.
It does not support extracting tar files (i.e., .tar, .tar.gz, etc.).
Does not handle URLs (cannot copy files from a URL).
- Copies files and directories from the host to the image.
- Does not extract compressed files.
- Cannot copy from URLs.
- Used for simple file copying.
ADD: The ADD instruction is similar to COPY, but it includes additional features. It is more advanced, as it supports features like extracting tar archives and handling URLs.
ADD automatically extracts compressed files (such as .tar, .tar.gz, etc.) into the destination directory inside the image. It can also handle remote URLs (HTTP/HTTPS).
ADD https://example.com/file.tar.gz /app/
- Copies files, directories, and URLs; can also extract tar archives.
- Automatically extracts compressed tar files (e.g., .tar, .tar.gz, .tar.xz).
- Can copy files from a URL to the container.
- Used when you need to extract tar files or copy from URLs.


Difference between docker container and virtual machine?
Docker containers share the host or kernal, making then lightweight and efficient compared to virtual machines. Containers encapsulate the application and dependancies, while VMS emulate an entire OS.
Docker: Lightweight(Take only things which is required), fast startup, Uses host resources dynamically, Processes are isolated, but they share the host OS kernel.
VM: Heavyweight, slow startup(OS needs to boot), Higher resource overhead: Fixed allocation of CPU, memory, etc., Fully isolated environment with its own OS.WD4444444444442


VM: Suppose I have a windows os laptop, and want to work on linux then we need seperate PC.
For windows PC there is hardware(RAM, CPU, Harddisk) this interacts with windows os on top of that there is application. Application interact with windows OS. 
With Virtualization: No seperate hardware needed -> This is done using Hypervisor.
In 1 PC we can install both windows and linux, both are isolated from each other if PC RAM is of 8GB, then both uses 4-4GB.
Hypervisor is VirtualBox. VirtualBox is made by Oracle, it's opensource and works on all OS.
VirtualBox takes hardware resources from Host OS. Creates virtual CPU, virtual RAM, virtual storage for each virtual machine.
Hardware resources are shared
If something breaks inside VM, it doesn't affect the host machine.
Hypervisor is a software jo virtualization possible karta hai

Containerization: Ek machine me code kiya hai wo dusre machine me nai work karta so waha se containerization ka concept aaya. Ek application jo develop and deployed and wrap hui hai with all configuration files  and dependancies. This is called container

k;[]
22
How to monitor docker containers in production?
- docker stats -> shows number of container running with id, name, mem usage, CPU utilazation, netI/O
- docker events(Monitors real-time Docker events (e.g., container start, stop, kill).)
- docker logs <container-id>o secure Docker containers?
Describe how you would update a running Docker container without causing downtime:
Use rolling updates by updating the service with cmd - docker service update --image <new_image>
How to share env variables securely between Docker containers?
Docker archicture
Docker namespace
lifecycle of docker container
How to access running container: docker exec -t container_id bash-*+


custom composable microservices via docker hub.



Dockerfile Optimization

    Multi-stage builds: Build lightweight production images by separating the build and runtime stages.
        Example: Use one stage to compile code and another to create a small runtime container.
    Use ONBUILD triggers to create reusable base images.
    Optimize image size by minimizing layers and using .dockerignore effectively.



Docker Compose Advanced Features

    Configure multiple services with shared networks and volumes.
    Use environment variables in docker-compose.yml for dynamic configurations.
    Implement health checks to monitor service health.

healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000"]
  interval: 30s
  timeout: 10s
  retries: 3

Scale services using docker-compose up --scale <service>=<count>.


Docker Volumes and Persistent Storage

    Use named volumes and bind mounts in different scenarios.
    Set up shared volumes for data exchange between containers.
    Back up and restore Docker volumes using:

docker run --rm -v <volume_name>:/data -v $(pwd):/backup busybox tar cvf /backup/backup.tar /data


Networking

    Explore custom Docker networks (bridge, overlay, host, and macvlan).
    Configure DNS within Docker networks to resolve container names.
    Use network aliases to simplify communication between services.
    Practice multi-host networking using Docker Swarm or Kubernetes.



Docker Security

    Use non-root users in containers.
    Scan images for vulnerabilities using tools like trivy or Docker's built-in scanning.

docker scan <image_name>

Enable resource limits (memory and CPU constraints).

    deploy:
      resources:
        limits:
          memory: 512M
          cpus: "0.5"

    Use --read-only flag to make the container filesystem immutable.





dvanced Image and Container Management

    Use custom base images tailored to your needs.
    Manage multi-architecture images using docker buildx.
    Implement container auto-restarts with restart policies:

docker run --restart=always <image>

Tag and version your images for better lifecycle management.



Build Automation and CI/CD

    Automate builds and deployments using Docker Hub, GitHub Actions, or GitLab CI/CD.
    Configure webhooks to trigger builds on code changes.
    Use tools like Jenkins or Drone to manage pipelines with Docker.



Docker Registry

    Set up a private Docker registry for hosting your images.

docker run -d -p 5000:5000 --name registry registry:2

Use signed images with docker trust for image integrity verification.



Monitoring and Logging

    Integrate Docker with ELK Stack (Elasticsearch, Logstash, Kibana) for centralized logging.
    Use Prometheus and Grafana to monitor container metrics.
    Configure logging drivers like json-file, syslog, or fluentd.



Advanced Debugging

    Use docker exec and docker logs for container diagnostics.
    Monitor resource usage with docker stats.
    Debug Docker network configurations with docker network inspect and tools like tcpdump.



Docker Plugins and Extensions

    Explore storage and network plugins, like Portworx for storage or Weave Net for networking.
    Use Docker Desktop extensions for enhanced functionality.



Containerization of Complex Applications

    Containerize multi-tier applications (e.g., React frontend, Node.js backend, and MongoDB database).
    Implement microservices architecture using Docker Compose 



Explore Alternative Container Runtimes

    Work with other runtimes like Podman, CRI-O, or Buildah to understand differences and use cases.

 [ ] Add logs monitoring using Prometheus / ELK stack 
- [ ] integration Docker Events to send notifications
- [ ] Service Discovery with Docker DNS (Health check)
- [ ] Automated Backup of volumes
- [ ] Multi-Stage Builds for Optimized Images
limit usage or just capture usage in terms of computing or memory

The proxy.web calls now route traffic to the correct service (website1 or website2) by using their container names.

HI.. I had words with Lankit last week, but little confused regarding few points mentioned below. He did not mean that you asked to do this but he suggested few points as well. I just want to know I need to cover this topics or not? I mean that are suggested by you
1) Should know syntax - fine
2) Integrate docker event - Is that needed as Docker emits events in real-time for container, image, volume, and network activities, such as: Container start/stop, Image pull/remove, Volume creation/removal, Network connect/disconnect
3) Interchange volume between container - in docker-compose file add volumes: - ./:/arthub in admin as well
4) How to switch node versions - # Run a container with Node.js version 14
docker run -it node :14 bash

# Run a container with Node.js version 18
docker run -it node:18 bash
To switch Node.js versions in Docker:

    Use the desired version tag (node:<version>).
    Update your Dockerfile or docker-compose.yml as needed.
    Start a new container with the updated version.
5) How docker differs with xxamp and lamp
6) minio
7) create shared hosting
8) ELK stack in node and docker
9) change configuration on running docker container
10) Automated Backup of volumes
11) shared network concept
12) what docker extension do?
13) custom composable microservices via docker hub.



scp admin@54.237.42.192:/var/am-www/webmodule-phillips/current/apps/shared/cache/n5-wright.* /var/www/html/auction-web-live-module/n5-wright

scp -r am-auction-widget-phillips-20240404-c498de8.js admin@184.73.91.116:/var/am-www/webmodule-phillips/current/public/js/am-auction-widget-phillips-20240404-c498de8.js