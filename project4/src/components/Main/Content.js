import './Content.css';
import {PostItem} from "./components/PostItem";
import {Component} from "react";
import {AddPostForm} from "./components/AddPostForm";
import {EditPostForm} from "./components/EditPostForm";
import {DeletePostForm} from "./components/DeletePostForm";
import axios from "axios";
import SearchIcon from '@mui/icons-material/Search';
import {LoginPage} from "./components/LoginPage";

const api = axios.create({
    baseURL: `http://localhost:5000/posts`
})


export class Content extends Component {

    state = {
        showAddForm: false,
        showEditForm: false,
        showDeleteForm: false,
        showLoginPage: false,
        blogArr: [],
        jsonArr: [],
        searchedBlogArr: [],
        selectedPost: {},
        isLoggedIn: (() => {
            return localStorage.getItem('isLoggedIn') === 'true';
        }),
        userName: localStorage.getItem('userName'),
        userPassword: localStorage.getItem('userPassword'),
        searchTag: "",
        likeArray: [],
        likeCounter: 0,
    }

    constructor() {
        super();
        this.getJsonPost()
    }

    getJsonPost = async () => {
        let data = await api.get('/').then(({data}) => data);
        this.setState({jsonArr: data})
        console.log(data)
    }

    createJsonPost = async (blogPost) => {
        let res = await api.post('/', blogPost)
        console.log(res)
    }

    deleteJsonPost = async (blogPost) => {
        return await api.delete(`/${blogPost.id}`)
    }

    editJsonPost = async (blogPost) => {
        return await api.put(`/${blogPost.id}`)
    }

    handleSetSearchedBlogArr = (searchTag) => {
        return [...this.state.blogArr].filter(temp => temp.tag.toLowerCase().includes(searchTag.toLowerCase()));
    }

    handleSearchTagChange = (e) => {
        console.log(this.state.searchTag)
        this.setState({
            searchTag: e.target.value
        })
    }

    setUserName = (name) => {
        this.setState({
            userName: name
        })
        console.log(this.state.userName)
    }

    setUserPassword = (password) => {
        this.setState( {
            userPassword: password
        })
    }

    handleShowAddForm = () => {

        this.setState({
            showAddForm: true
        })
    }

    handleHideAddForm = () => {

        this.setState({
            showAddForm: false
        })
    }

    handleShowEditForm = () => {

        this.setState({
            showEditForm: true
        })
    }

    handleHideEditForm = () => {

        this.setState({
            showEditForm: false
        })
    }

    handleShowDeleteForm = () => {

        this.setState({
            showDeleteForm: true
        })
    }

    handleHideDeleteForm = () => {

        this.setState({
            showDeleteForm: false
        })
    }

    handleShowLoginPage = () => {
        this.setState({
            showLoginPage: true
        })
    }

    handleHideLoginPage = () => {

        this.setState({
            showLoginPage: false
        })
    }

    handleLogIn = (e) => {
        this.setState({
            showLoginPage: false,
            isLoggedIn: true
        })
    }

    handleLogOut = (e) => {
        this.setState({
            isLoggedIn: false,
            userName: ""
        })
        localStorage.setItem('isLoggedIn', false)
        localStorage.setItem('userName', '')
        localStorage.setItem('userPassword', '')
    }

    handleEscape = (e) => {
        if (e.key === 'Escape' && this.state.showAddForm) {
            this.handleHideAddForm()
        }
        if (e.key === 'Escape' && this.state.showEditForm) {
            this.handleHideEditForm()
        }
        if (e.key === 'Escape' && this.state.showDeleteForm) {
            this.handleHideDeleteForm()
        }
        if (e.key === 'Escape' && this.state.showLoginPage) {
            this.handleHideLoginPage()
        }
    }

    componentDidMount() {
        this.getPosts()
        window.addEventListener('keyup', this.handleEscape)
    }

    componentWillUnmount() {
        window.removeEventListener('keyup', this.handleEscape)
    }

    getPosts = () => {
        axios.get('https://62c570e8a361f7251284731c.mockapi.io/posts')
            .then((response) => {
                this.setState({
                    blogArr: response.data
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    addNewPost = (blogPost) => {
        axios.post('https://62c570e8a361f7251284731c.mockapi.io/posts', blogPost)
            .then((response) => {
                this.getPosts()
            })
            .catch((err) => {
                console.log(err)
            })
    }

    editBlogPost = (updatedBlogPost) => {
        axios.put(`https://62c570e8a361f7251284731c.mockapi.io/posts/${updatedBlogPost.id}`, updatedBlogPost)
            .then((response) => {
                this.getPosts()
            })
            .catch((err) => {
                console.log(err)
            })
        console.log(updatedBlogPost)
        this.editJsonPost(updatedBlogPost).then(data => console.log(data))
        this.getJsonPost().then(data => console.log(data))
    }

    likePost = (blogPost) => {

        const temp = {...blogPost};
        console.log(temp.likeArray.includes(this.state.userName))
        if ( this.state.userName !== "") {
            if (temp.likeArray.includes(this.state.userName)) {
                temp.likeArray.splice(temp.likeArray.indexOf(this.state.userName), 1)
            } else {
                temp.likeArray.push(this.state.userName)
            }
        } else {
            return
        }

        temp.likeCounter = temp.likeArray.length
        axios.put(`https://62c570e8a361f7251284731c.mockapi.io/posts/${blogPost.id}`, temp)
            .then((response) => {
                this.getPosts()
            })
            .catch((err) => {
                console.log(err)
            })
        console.log(temp)
        this.editJsonPost(temp).then(data => console.log(data))
        this.getJsonPost().then(data => console.log(data))
    }

    deletePost = (blogPost) => {
        axios.delete(`https://62c570e8a361f7251284731c.mockapi.io/posts/${blogPost.id}`)
            .then((response) => {
                this.getPosts()
            })
            .catch((error) => {
                console.log(error)
            })
        this.deleteJsonPost(blogPost).then(data => console.log(data))
        this.getJsonPost().then(data => console.log(data))
    }

    handleSelectPost = (blogPost) => {
        this.setState({
            selectedPost: blogPost
        })
    }

    preDef = (e) => {
        e.preventDefault()
    }

    render() {

        const searchedBlogPosts = this.handleSetSearchedBlogArr(this.state.searchTag).map((item) => {
            return (
                <PostItem
                    key={item.id}
                    title={item.title}
                    tag={item.tag}
                    body={item.body}
                    likeArray={item.likeArray}
                    likeCounter={item.likeCounter}
                    name={item.name}
                    password={item.password}
                    likePost={() => this.likePost(item)}
                    deletePost={() => this.deletePost(item)}
                    handleShowEditForm={this.handleShowEditForm}
                    handleShowDeleteForm={this.handleShowDeleteForm}
                    handleSelect={() => this.handleSelectPost(item)}
                    currentName={this.state.userName}
                />
            )
        })

        const blogPosts = this.state.blogArr.map((item) => {
            return (
                <PostItem
                    key={item.id}
                    title={item.title}
                    tag={item.tag}
                    body={item.body}
                    likeArray={item.likeArray}
                    likeCounter={item.likeCounter}
                    name={item.name}
                    password={item.password}
                    likePost={() => this.likePost(item)}
                    deletePost={() => this.deletePost(item)}
                    handleShowEditForm={this.handleShowEditForm}
                    handleShowDeleteForm={this.handleShowDeleteForm}
                    handleSelect={() => this.handleSelectPost(item)}
                    currentName={this.state.userName}
                />
            )
        })

        return (

            <div className="blogPage">

                {
                    this.state.showLoginPage ?
                        <LoginPage
                            isLoggedIn={this.state.isLoggedIn}
                            setUserName={this.setUserName}
                            setUserPassword={this.setUserPassword}
                            handleLogIn={this.handleLogIn}
                            handleHideLoginPage={this.handleHideLoginPage}
                        />
                        :
                        null
                }

                {
                    this.state.showAddForm ?
                        <AddPostForm blogArr={this.state.blogArr}
                                     handleHideAddForm={this.handleHideAddForm}
                                     addNewPost={this.addNewPost}
                                     name={this.state.userName}
                                     password={this.state.userPassword}
                                     createJsonPost={this.createJsonPost}
                        />
                        :
                        null
                }

                {
                    this.state.showEditForm ?
                        <EditPostForm
                            handleHideEditForm={this.handleHideEditForm}
                            selectedPost={this.state.selectedPost}
                            editBlogPost={this.editBlogPost}
                            currentName={this.state.userName}
                            currentPassword={this.state.userPassword}
                        />
                        :
                        null
                }

                {
                    this.state.showDeleteForm ?
                        <DeletePostForm
                            handleHideDeleteForm={this.handleHideDeleteForm}
                            selectedPost={this.state.selectedPost}
                            deletePost={this.deletePost}
                            currentName={this.state.userName}
                            currentPassword={this.state.userPassword}
                        />
                        :
                        null
                }

                <div className="addNewPost">
                    {
                        !this.state.isLoggedIn || (this.state.userName === '') ?
                            <div>
                                <button className="blackBtn" onClick={this.handleShowLoginPage}>Войти</button>
                            </div>
                        :
                            <div>
                                <button className="blackBtn" onClick={this.handleLogOut}>{this.state.userName}: Выйти</button>
                            </div>
                    }


                    <form method="get" className="searchTags" onSubmit={this.handleSetSearchedBlogArr(this.state.searchTag)}>
                        <input
                            className="searchTagsInput"
                            placeholder="Найти цель по тегу"
                            onChange={this.handleSearchTagChange}
                        />
                        <button className="searchTagsBtn" onClick={this.preDef}>
                            <SearchIcon/>
                        </button>
                    </form>
                    {
                        !this.state.isLoggedIn || (this.state.userName === '') ?
                            <div>
                                <button className="blackBtn" onClick={this.handleShowLoginPage}>Поделиться опытом</button>
                            </div>
                            :
                            <div>
                                <button className="blackBtn" onClick={this.handleShowAddForm}>Поделиться опытом</button>
                            </div>
                    }

                </div>
                <div className="posts">
                    {(this.state.searchTag === "")
                        ?
                        <>{blogPosts}</>
                        :
                        <>{searchedBlogPosts}</>
                    }


                </div>

            </div>
        )
    }
}