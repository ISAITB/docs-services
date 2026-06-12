Using the template project produces a web application built using the `Spring Boot`_ framework. In terms of design it is interesting to highlight
certain key points:

    * Supporting components are already provided to address e.g. session management.
    * Configuration of the service uses the standard Spring Boot `application.properties`_ file.
    * Web services are implemented using the `Apache CXF`_ framework.
    * A series of useful utility methods are made available that would cover most basic GITB-specific coding needs.

In terms of development tools:

    * Maven is used for all build tasks.
    * Spring Boot's `auto-reload capabilities`_ are activated to facilitate development.
    * The configuration and commands for Docker image creation are included.
