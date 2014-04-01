/*
 * PostItem represents a single post in a thread.
 */
var PostItem = new Class({		
    initialize: function(id, name, date,  comment){
        this.id = id;
        this.date = date;
        this.name = name;
        this.comment = comment;
    },	
    display: function(){
        // Containing postItem element
        var cont = new Element('div',{
            'class':'postItem',
            'id': this.id + 'post'
        });
        // Title area of the post, includes user info & utilities
        var title = new Element('div',{
            'class':'postTitle grid_12 alpha omega',   
            styles: {
                'background-color': '#6E9489',
                'border': '1px #4b655d solid',
                'color': '#d9e3e0',    
                'margin-top' : '5px',
                'margin-left' : '0px',
                'margin-bottom' : '0px',
                'padding' : '5px',
                'padding-right' : '15px',
                'font-size' : '12px',
                'text-align' : 'center'
            }         
        });
        var user = new Element('p',{
            'class':'postUser grid_11',
            'text':' posted on ' + this.date
        });
        var username = new Element('strong', {
            'text' : this.name,
            styles: {
                'font-size' : '15px'
            }
        });
        var commentCont = new Element('div', {
            'id' : this.id + 'pComCont',
            'class':'postComment grid_12 alpha omega',
            styles: {
                'background-color': '#9fb9b1',
                'border': '1px #84a69c solid',
                'margin-top' : '3px',
                'margin-left' : '0px',
                'margin-bottom' : '10px',
                'padding' : '5px',
                'padding-left' : '15px'
            }            
        });
        // Comment made by the user
        var comment = new Element('p',{
            'id' : this.id +'pComment',
            'text' : this.comment,
            styles: {
                margin: '5px'
            }
        });
        comment.inject(commentCont);
        // Utility area of the post (edit/delete)
        var util = new Element('p', {
            'class' : 'grid_1'
        });
        // Icon to delete the post
        var del = new Element('img', {
            'src' : 'images/comment_delete.png',
            'id' : this.id + 'pDelete',
            styles: {
                opacity: '0.4',
                marginRight: '15px'
            },
            events: {
                mouseenter: function(){
                    this.tween('opacity', '1');
                },
                mouseleave: function(){
                    this.tween('opacity', '0.4');
                },
                click: deletePost
            }
        });
        // Icon to edit the post
        var ed = new Element('img', {
            'src' : 'images/comment_edit.png',
            'id' : this.id + 'pEdit',
            styles: {
                opacity: '0.4'
            },
            events: {
                mouseenter: function(){
                    this.tween('opacity', '1');
                },
                mouseleave: function(){
                    this.tween('opacity', '0.4');
                },
                click: showEditPost
            }
        });
        del.inject(util);
        ed.inject(util);        
        username.inject(user, 'top');
        user.inject(title);
        util.inject(title);
        title.inject(cont);
        commentCont.inject(cont);
        return cont;
    }
});

/*
 * ThreadContainer holds all the posts in a thread
 */
var ThreadContainer = new Class({
    initialize: function(id) {
        this.id = id;
    },
    show: function() {
        var container = new Element('div', {
            'class' : 'threadContainer',
            'id' : this.id + 'container',
            styles: {
                'margin' : '0px'
            }
        });
        return container;
    }
})

/*
 * ThreadListItem represents the items in the list of threads which
 * a user can post on. Also is used at the top of the thread to show
 * the thread that is currently being displayed.
 */
var ThreadListItem = new Class({		
    initialize: function(id, title, op){
        this.id = id;
        this.title = title;
        this.op = op;
    },	
    display: function(){
        // Containing element
        var cont = new Element('div',{
            'class':'threadItem grid_12 alpha omega',
            'id':this.id + 'thread',
            'open' : 'false',
            events: {
                click: getThread
                }
            });
        // Title of the thread
        var title = new Element('p',{
            'class':'threadTitle grid_7',
            'text':this.title,
            'id': this.id + 'title'
        });        
        // Creator (OP) of the thread
        var op = new Element('p',{
            'class':'threadPoster grid_4',
            'text':'posted by ' + this.op
        });	  
        // Utility section of the thread (edit/delete)
        var util = new Element('p',{
            'class':'threadUtil grid_1'
        });	
        // Icon to delete the thread
        var del = new Element('img', {
            'src' : 'images/cross.png',
            'id' : this.id + 'tDelete',
            styles: {
                opacity: '0.4',
                marginRight: '7px'
            },
            events: {
                mouseenter: function(){
                    this.tween('opacity', '1');
                },
                mouseleave: function(){
                    this.tween('opacity', '0.4');
                },
                click: deleteThread
            }
        });
        // Icon to edit the thread
        var ed = new Element('img', {
            'src' : 'images/page_white_edit.png',
            'id' : this.id + 'tEdit',
            styles: {
                opacity: '0.4'
            },
            events: {
                mouseenter: function(){
                    this.tween('opacity', '1');
                },
                mouseleave: function(){
                    this.tween('opacity', '0.4');
                },
                click: showEditThread
            }
        });
        title.inject(cont);
        op.inject(cont);
        del.inject(util);
        ed.inject(util);
        util.inject(cont);
        return cont;
    }
});
