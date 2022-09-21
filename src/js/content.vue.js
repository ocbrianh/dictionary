Vue.component('dictionary-form', {
  data: function () {
    return {
      term: "",
      searchedTerm: [],
      definition: [],
      newDefinition: "",
      recentSearches: [],
      needDefinitions: [],
      error: "",
      success: "",
    }
  },
  mounted() {
    this.getUndefinedTerms();
    this.getRecentSearches();
  },
  methods: {
    submitTerm: function(event) {
      event.preventDefault();
      console.log(this.term.trim());
      this.clearErrorSuccess();

      if(this.term.length > 0) {
        axios.get("http://localhost:8080/index.php?func=lookupDefinition&term=" + this.term.trim())
        .then(res => {
          if(res.data.status == "success") {
            if(res.data.definition[0]) {
              Vue.set(this.definition, 0, res.data.definition[0]);
            }
            console.log(this.definition);

            Vue.set(this.searchedTerm, 0, [res.data.term, res.data.term_id]);
            this.getUndefinedTerms();
            this.getRecentSearches();
            this.success = "Term lookup was a success!";
          }
        })
        .catch(error => {
          console.log(error)
        })
      } else {
        this.error = "Please enter a term to lookup.";
      }
      
    },
    submitDefinition: function(event) {
      event.preventDefault();
      this.clearErrorSuccess();

      if(!this.searchedTerm.length) {
        this.error = "Search for a term first, to update the definition.";
        return false;
      }

      if(this.newDefinition.length == 0) {
        this.error = "Definition can not be empty.";
        return false;
      }

      let term_id = this.searchedTerm[0][1];
      let definition = this.newDefinition;

      if(this.definition.length > 0) {
        let definition_id = this.definition[0][0];
        $axiosURL = "http://localhost:8080/index.php?func=updateDefinition&term_id=" + term_id + "&definition=" + definition + "&definition_id=" + definition_id;
      } else {
        $axiosURL = "http://localhost:8080/index.php?func=updateDefinition&term_id=" + term_id + "&definition=" + definition;
      }

      axios.get($axiosURL)
      .then(res => {
        if(res.data.status == "success") {
          if(res.data.definition[0]) {
            Vue.set(this.definition, 0, res.data.definition[0]);
          }
          this.success = "Definition has been updated!"
          this.newDefinition = "";
        }
      })
      .catch(error => {
        console.log(error)
      })
    },
    getUndefinedTerms: function() {
      axios.get("http://localhost:8080/index.php?func=listUndefinedTerms")
      .then(res => {
        if(res.data.totals > 0) {
          let results = res.data.results;
          for (let i = 0; i < results.length; i++) {
            Vue.set(this.needDefinitions, i, results[i]);
          } 
        }
      })
      .catch(error => {
        console.log(error)
      })
    },
    getRecentSearches:  function() {
      axios.get("http://localhost:8080/index.php?func=listRecentDefinitions")
      .then(res => {
        if(res.data.totals > 0) {
          let results = res.data.results;
          for (let i = 0; i < results.length; i++) {
            Vue.set(this.recentSearches, i, results[i]);
          } 
        }
      })
      .catch(error => {
        console.log(error)
      })
    },
    clearErrorSuccess: function() {
      this.error = "";
      this.success = "";
    }
  },
  template: `
  <div>
    <form id="lookup-form">
      <div class="form-group">
        <div class="input-group">
          <input v-model="term" class="form-control py-2 border-right-0 border" type="search" placeholder="Look up a term" name="lookup-input">
          <span class="input-group-append">
            <button class="btn btn-outline-secondary border-left-0 border" type="button" v-on:click="submitTerm">
              <i class="fa fa-search"></i>
            </button>
          </span>
        </div>
      </div>
    </form>
    <div class="row">
      <div class="col-md-12">
        <p class="error-message text-center" v-if="error">
          Error: {{error}}
        </p>
        <p class="success-message text-center" v-if="success">
          Success: {{success}}
        </p>
      </div>
    </div>
    <form id="definition-form">
      <h3>TERM</h3>
      <p v-if="searchedTerm.length">{{this.searchedTerm[0][0]}}</p>
      <ul v-if="definition.length" class="definition-list">
        <li>{{ definition[0][2] }}</li>
      </ul>
      <div class="row">
        <div class="col-md-12">
          <div class="form-group">
            <label for="definition-text">Definition</label>
            <textarea v-model="newDefinition" class="form-control" id="definition-text" rows="3"></textarea>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12 text-right">
          <button type="button" v-on:click="submitDefinition">Submit</button>
        </div>
      </div>
      <hr />
      <div class="row">
        <div class="col-md-12">
          <h3>RECENT SEARCHES</h3>
          <ul v-if="recentSearches.length" class="recent-search-list">
            <li v-for="(value, index) in recentSearches" :key="index">
              {{ recentSearches[index][1] }}
            </li>
          </ul>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <h3>TERMS NEEDING DEFINITIONS</h3>
          <ul v-if="needDefinitions.length">
            <li v-for="(value, index) in needDefinitions" :key="index">
              {{ needDefinitions[index][1] }}
            </li>
          </ul>
        </div>
      </div>
    </form>
  </div>
  `
})