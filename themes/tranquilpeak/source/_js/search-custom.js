function SearchCustom(path, searchBlockSelector) {
  this.path = path;
  this.searchBlock = document.querySelector(searchBlockSelector);
  this.inputEl = this.searchBlock.querySelector('input.search-custom__form-control');
  this.resultEl = document.querySelector('.search-custom__result');
}

SearchCustom.prototype.init = function() {
  fetch(location.origin + '/' + this.path)
    .then(function(res) {
      this.initToggle()
      return res.json();
    }.bind(this))
    .then(this.search.bind(this))
}

SearchCustom.prototype.initToggle = function() {
  this.searchBlock.querySelector('.search-custom__search-button').onclick = function() {
    var input = this.inputEl;
    input.classList.toggle('hidden');
    input.focus();
    if (input.classList.contains('hidden')) {
      this.hideMatches();
    }
  }.bind(this);
}

SearchCustom.prototype.search = function(searchData) {
  var self = this;

  this.inputEl.addEventListener('input', function () {
    var searchValue = this.value.toLowerCase().trim();
    self.resultEl.innerHTML = '';

    if (searchValue.length <= 0 || searchValue.length > 60) {
      return;
    }

    self._keywords = searchValue.split(' ');
    self._ulEl = document.createElement('ul');
    self._ulEl.classList.add('search-result-list');

    searchData.posts.forEach(function (data) {
      self._title = data.title.trim();
      self._content = data.text.trim();
      self._urlRelative = data.path;

      self._isMatch = true;
      self._firstOccur = -1;

      self.getMatches();
      self.buildMatches();
    })
  })
};

SearchCustom.prototype.getMatches = function() {
  var indexTitle = -1;
  var indexContent = -1;
  var self = this;

  if (self._content) {
    self._keywords.forEach(function(keyword, i) {
      indexTitle = self._title.toLowerCase().indexOf(keyword);
      indexContent = self._content.toLowerCase().indexOf(keyword);

      if (indexTitle < 0 && indexContent < 0) {
        self._isMatch = false;
      } else {
        if (indexContent < 0) {
          indexContent = 0;
        }
        if (i == 0) {
          self._firstOccur = indexContent;
        }
      }
    })
  } else {
    self._isMatch = false;
  }
};

SearchCustom.prototype.buildMatches = function() {
  if (this._isMatch) {
    var liEl = document.createElement('li');
    var anchorEl = document.createElement('a');
    var content = this._content;

    anchorEl.href = location.origin + '/' + this._urlRelative;
    anchorEl.textContent = this._title;
    liEl.appendChild(anchorEl);

    if (this._firstOccur >= 0) {
      // cut out 50 char
      var start = this._firstOccur - 20;
      var end = this._firstOccur + 10;

      if (start <= 0) {
        start = 0;
        end = 30;
      }

      if (end > content.length) {
        end = content.length;
      }

      var matchedContent = content.slice(start, end);

      // highlight the match
      this._keywords.forEach(function(keyword) {
        var regExp = new RegExp(keyword, 'gi');
        matchedContent = matchedContent.replace(regExp, '<em class="search-result">' + keyword +'</em>');
      })

      var elDiv = document.createElement('div');
      elDiv.innerHTML = matchedContent;
      liEl.appendChild(elDiv);
    }
    this._ulEl.appendChild(liEl);
  }
  this.resultEl.appendChild(this._ulEl);
};

SearchCustom.prototype.hideMatches = function() {
  this.resultEl.innerHTML = '';
  this.inputEl.classList.add('hidden')
  this.inputEl.value = '';
}

var search = new SearchCustom('content.json', '#search-custom');
search.init();
