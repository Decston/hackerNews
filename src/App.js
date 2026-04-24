import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;

const isSearched = searchTerm => item => 
  item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      result: null, //Armazena o resultado da lista de noticias hackers que serão renderizadas.
      searchTerm: DEFAULT_QUERY, //Armazena o termo a ser buscado através do input 
    };

    //Faz o bind da função que vai atualizar o estado da variavel result, depois de trazer da api.
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    //Faz o bind da função que altera o termo de busca, depois de alterado pelo usuário.
    this.onSearchChange = this.onSearchChange.bind(this);
    //Faz o bind da função que recebe o id e retira o item da lista de acordo com o id passado.
    this.onDismiss = this.onDismiss.bind(this);
  }

  //Esse função é executada logo após o componente ser montado.
  componentDidMount() {
    //Pega o valor default de searchTerm após o objeto ser montado.
    const { searchTerm } = this.state;
  
    //Executa uma chamada a api hacker news, buscando no endereço passado as noticias de acordo
    //com o termo default da variavel searchTerm. Recebe a resposta em json e o resultado da
    //requesição é setado na variavel result através do método setSearchTopStories.
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error);
  }

  //Atualiza o estado da variavel result, sendo utilizada na primeira requisição feita a api.
  //Acontecendo após o objeto ser montado.
  setSearchTopStories(result) {
    //Pega a lista de noticias advinda da api hacker news passado como parametro
    //e seta na variavel result do state.
    this.setState({ result });
  }

  //Atualiza o termo que irá ser buscado a cada alteração do usuario no input Search.
  onSearchChange(event) {
    //Pega o evento advindo do input de Search, depois de cada atualização e seta o valor
    //escrito no input para a variavel searchTerm no estado do componente.  
    this.setState({ searchTerm: event.target.value });
  }

  //Função que recebe o id de uma noticia da lista, passado pelo botão dismiss do componente
  //Table, onde será feita uma filtragem dessa noticia a partir do seu id e atualizada a
  //variavel result do state através de um método spread, recebendo a lista já existente e
  //a nova lista filtrada.
  onDismiss = (id) => {
    //Cria uma função isNotId para armazenar o valor booleano, testando se o id do item é igual 
    //ao id que foi passado como parametro. 
    const isNotId = item => item.objectID !== id;
    //Cria a const updatedHits para armazenar a nova lista que filtra o item que teve seu id 
    //repassado como parametro. (Se o id do item for diferente do id repassado 
    //retorna true) Com isso ao testar a função isNotId, só vai tirar da nova lista quando 
    //o id do item for igual ao id passado como parametro. 
    const updatedHits = this.state.result.hits.filter(isNotId);
    //Atualiza o valor da variavel result utilizando o operador Spread, pois o objeto result
    //advindo da api do hacker news tem mais atributos do que a lista filtrada. Assim atualizamos
    //apenas o atributo hits do result.
    this.setState({ 
      result: { ...this.state.result, hits: updatedHits }
    });
  }

  //Método que renderiza o jsx do componente.
  render() {
    //Faz a desestruturação do estado nas variaveis searchTerm e result.
    const { searchTerm, result } = this.state;

    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
          >Search</ Search>
        </div>
        { result &&
          <Table
            list={result.hits}
            pattern={searchTerm}
            onDismiss={this.onDismiss}
          />
        }
      </div>
    );
  }
}

const Search = ({ value, onChange, children }) =>
  <form>
    {children}
    <input 
      type='text'
      value={value}
      onChange={onChange} 
    />
  </form>

const largeColumn = {
  width: "30%"
}

const midColumn = {
  width: "25%"
}

const smallColumn = {
  width: "10%"
}

const Table = ({ list, pattern, onDismiss }) => 
  <div className="table">
    {list.filter(isSearched(pattern)).map(item =>
      <div key={item.objectID} className="table-row">
        <span style={ largeColumn }>
          <a href={item.url}>{item.title}</a>
        </span>
        <span style={ midColumn }>{item.author}</span>
        <span style={ smallColumn }>{item.num_comments}</span>
        <span style={ smallColumn }>{item.points}</span>
        <span style={ smallColumn }>
          <Button
            onClick={() => onDismiss(item.objectID)}
            className="button-inline"
          >Dismiss</Button>
        </span>
      </div>
    )}
  </div>

const Button = ({ onClick, className='', children }) => 
  <button
    onClick={onClick}
    className={className}
    type='button'
  >{children}</button>

export default App;
