new Vue({
  el: '#app',
  data: {
		quotes: [],
		currentSort:'source',
		currentSortDir:'asc',
		pageSize:15,
		currentPage:1,
		search: '',
		themeFilter: 'All',
		results: []
  },
  created: function(){
  	this.fetchData();
  },
  methods: {
  	fetchData: function(){
  		var self = this;
  		fetch('https://gist.githubusercontent.com/benchprep/dffc3bffa9704626aa8832a3b4de5b27/raw/quotes.json')
  		.then(function(response){
  			response.json()
  			.then(function(json){
  				self.quotes = json;
  			})
  		})
  	},
		sort: function(sortString){
		  if(sortString === this.currentSort) {
		    this.currentSortDir = this.currentSortDir === 'asc' ? 'desc':'asc';
		  }
		  this.currentSort = sortString;
		},
		nextPage: function(){
		  if((this.currentPage*this.pageSize) < this.quotes.length){
		  	this.currentPage++;
		  }
		},
		prevPage: function(){
		  if(this.currentPage > 1){
		  	this.currentPage--;
		  }
		},
		filterByTheme: function(){
			var self = this;
			switch (self.themeFilter) {
			  case 'All':
			    return self.quotes;
			    break;
			  case 'Movies':
			    return self.quotes.filter(function(item){
			    	return item.theme === 'movies';
			    })
			    break;
			  case 'Games':
			    return self.quotes.filter(function(item){
			    	return item.theme === 'games';
			    })
			    break;
			}
		},
		filterBySearch: function(results){
			var self = this;
			return results.filter(function(item){
      	return item.quote.toLowerCase().indexOf(self.search.toLowerCase()) > -1;
      })
		},
		filterBySort: function(results){
			var self = this;
			return results.sort(function(a,b){
			  var modifier = 1;
			  if(self.currentSortDir === 'desc') modifier = -1;
			  if(a[self.currentSort] < b[self.currentSort]) return -1 * modifier;
			  if(a[self.currentSort] > b[self.currentSort]) return 1 * modifier;
			  return 0;
			})
		},
		paginate: function(results){
			var self = this;
			return results.filter(function(row, index){
			  var start = (self.currentPage-1)*self.pageSize;
			  var end = self.currentPage*self.pageSize;
			  if(index >= start && index < end) return true;
			})
		}
  },
  computed:{
    getResults: function(){
      var self = this;
      
      // filter by theme selection
      var results = self.filterByTheme();

      // filter by search input
      results = self.filterBySearch(results);
      
      // sorts results
      results = self.filterBySort(results);
      
      // paginates the results
      results = self.paginate(results);
      
      return self.results = results;
    }
  }
})