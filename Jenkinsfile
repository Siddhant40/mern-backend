pipeline {
    agent any

    environment {
        SONAR_SCANNER_PATH = 'C:\\Users\\91844\\Downloads\\sonar-scanner-cli-6.2.1.4610-windows-x64\\sonar-scanner-6.2.1.4610-windows-x64\\bin\\sonar-scanner.bat'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies - Backend') {
            steps {
                bat 'npm install'  
            }
        }
                stage('Run Tests') {
            steps {
                bat 'npm test'  // Run the backend tests (if you have tests)
            }
        }

        stage('Start Server') {
            steps {
                bat 'npm start'  // Run your backend server (if it's a production app, this could be a different command)
            }
        }

        stage('SonarQube Analysis') {
            environment {
                SONAR_TOKEN = credentials('SonarQube')
            }
            steps {
                script {
                    bat """
                        %SONAR_SCANNER_PATH% ^
                        -Dsonar.projectKey=mern-backend ^
                        -Dsonar.projectName=mern-backend ^
                        -Dsonar.sources=. ^
                        -Dsonar.host.url=http://localhost:9000 ^
                        -Dsonar.token=${SONAR_TOKEN}
                    """
                }
            }
        }


    }

    post {
        always {
            echo 'Pipeline execution finished'
        }
        success {
            echo 'Pipeline executed successfully'
        }
        failure {
            echo 'Pipeline failed'
        }
    }
}
