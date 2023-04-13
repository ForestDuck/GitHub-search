'use strict';

// Workshop: GitHub search (Github API)

// Github
// UI

const GITHUB_API = 'https://api.github.com/';
const searchUser = document.querySelector('.searchUser');

// https://api.github.com/users/username
// https://api.github.com/users/username?client_id=d9308aacf8b204d361fd&client_secret=84969aeef73956f4ec9e8716d1840532802bb81b

class Github {
    constructor() {
        this.clientId = '45281d45e731581ffeb9';
        this.clientSecret = 'c18ceffe633091435b0e61efa2f605df6e16ed11';
    }

    // https://api.github.com/
    async getUser(userName) {
        const response = await fetch(`${GITHUB_API}users/${userName}?client_id=${this.clientId}&client_secret=${this.clientSecret}`);
        const user = await response.json();
        return user;
    }
    
}

class UI {
    constructor() {
        this.profile = document.querySelector('.profile');
    }

    showProfile(user) {
        this.profile.innerHTML = `
        <div class="card card-body mb-3">
        <div class="row">
          <div class="col-md-3">
            <img class="img-fluid mb-2" src="${user.avatar_url}">
            <a href="${user.html_url}" target="_blank" class="btn btn-primary btn-block mb-4">View Profile</a>
          </div>
          <div class="col-md-9">
            <span class="badge badge-primary">Public Repos: ${user.public_repos}</span>
            <span class="badge badge-secondary">Public Gists: ${user.public_gists}</span>
            <span class="badge badge-success">Followers: ${user.followers}</span>
            <span class="badge badge-info">Following: ${user.following}</span>
            <br><br>
            <ul class="list-group">
              <li class="list-group-item">Company: ${user.company}</li>
              <li class="list-group-item">Website/Blog: ${user.blog}</li>
              <li class="list-group-item">Location: ${user.location}</li>
              <li class="list-group-item">Member Since: ${user.created_at}</li>
            </ul>
          </div>
        </div>
      </div>
      <h3 class="page-heading mb-3">Latest Repos</h3>
      <div class="repos"></div>
        `;
     this.showLastRepos(user.login);
  }

  async showLastRepos(userName) {
    const response = await fetch(`${GITHUB_API}users/${userName}/repos?per_page=5&sort=updated`);
    const repos = await response.json();
    const reposDiv = this.profile.querySelector('.repos');
  
    reposDiv.innerHTML = `
      <div class="list-group">
        ${repos.map(repo => `
          <a href="${repo.html_url}" target="_blank" class="list-group-item list-group-item-action">${repo.full_name}</a>
        `).join('')}
      </div>
      <div class="mt-3"></div>
    `;
  }

    showAlert(message, className) {
        this.clearAlert();

        const div = document.createElement('div');
        div.className = className;
        div.innerHTML = message;

        const search = document.querySelector('.search');
        search.before(div);

        setTimeout(() => {
            this.clearAlert()
        }, 3000)
    }

    clearAlert() {
        const alert = document.querySelector('.alert');
        if (alert) {
            alert.remove();
        }
    }

    clearProfile() {
        this.profile.innerHTML = '';
    }
    debounce(func, delay) {
        return (...args) => {
          if (this.debounceTimeoutId) {
            clearTimeout(this.debounceTimeoutId);
          }
          this.debounceTimeoutId = setTimeout(() => {
            func.apply(this, args);
          }, delay);
        };
      }
     

 
    
  async handleSearch(event) {
    const userText = event.target.value;
    const response = await github.getUser(userText);
  
    if (userText.trim() !== '') {
      if (response.message === 'Not Found') {
        this.showAlert('User not found', 'alert alert-danger');
      } else {
        this.showProfile(response);
      }
    } else {
      this.clearProfile();
    }
  }
}
    
    const github = new Github();
    const ui = new UI();
    
    searchUser.addEventListener('keyup', ui.debounce(ui.handleSearch, 500));
