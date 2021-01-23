node{
    stage('Scm checkout'){
        def gitexec = tool name: 'Default', type: 'git'
        git branch: 'main', credentialsId: 'cap10-github', url: 'https://github.com/invenico-zw/wallet-agent-frontend.git'
    }

    stage('Build docker image'){
        sh 'docker-compose build'
    }

    /*stage('Github Packages Login'){
           sh "cat /var/lib/jenkins/INVENICO_TOKEN.txt | docker login docker.pkg.github.com -u invenico-repo --password-stdin"
    }*/
    stage('tagging image'){
    sh 'docker tag wallet-agent-frontend:latest cap10/myrepository:wallet-agent-frontend'
    }
    /*stage('Push new image'){
        sh 'docker push docker.pkg.github.com/invenico-zw/wallet-agent-frontend/wallet-agent-frontend:v1'
    }*/

    stage('Push new image'){
     withCredentials([string(credentialsId: 'docker-pwd', variable: 'dockerHubPwd')]) {
        // some block
        sh "docker login -u cap10 -p ${dockerHubPwd}"
        }
        sh 'docker push cap10/myrepository:wallet-agent-frontend'
    }

    /*stage('Pull new image'){
        def dockerRun ='docker pull docker.pkg.github.com/invenico-zw/remit-agent-frontend/remit-frontend-agent:v1'
        sshagent(['remit']) {
            sh "ssh -o StrictHostKeyChecking=no -p 9301 venon@62.171.136.41 ${dockerRun}"
        }
    }*/
}