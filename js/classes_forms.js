/*
 * PostForm is the form which allows the user to add a post
 * to the thread they are currently viewing.
 */
var PostForm = new Class({
    initialize: function(threadId) {   
        this.thread_id = threadId;
    },
    display: function() {
        var form = new Element('form', {
            'id' : 'newPostForm',
            'action' : '#',
            'class' : 'grid_4',
            events: {
                submit: addPost
            }
        });
        var div = new Element('div');
        // Hidden ID element passed so the post is added to correct thread
        var threadIdInput = new Element('input', {
            'name' : 'thread_id',
            'value' : this.thread_id,
            'type' : 'hidden'
        })
        threadIdInput.inject(div);
        var nameInput = new Element('input', {
            'type' : 'text',
            'name' : 'username',
            'value' : 'Name',
            'class' : 'grid_4',  
            events: {
                focus: function() {
                    // If the default value is in the box when user focuses
                    if (this.value == 'Name') {
                        // Remove the value
                        this.value = '';
                    }
                    this.tween('background-color', '#998a73');
                },
                blur: function(){
                    this.tween('background-color', '#877963')
                }
            }
        });
        nameInput.inject(div);
        var commentInput = new Element('textarea', {
            'name' : 'comment',
            'value' : 'Your comment here...',
            'class' : 'grid_4',
            events: {
                focus: function() {
                    if (this.value == 'Your comment here...') {
                        this.value = '';
                    }
                    this.tween('background-color', '#998a73');
                },
                blur: function(){
                    this.tween('background-color', '#877963')
                }
            }
        });
        commentInput.inject(div);
        var submitButton = new Element('input', {
            'type' : 'submit',
            'value' : 'Submit Post',
            'class' : 'grid_2',
            events: {
                mouseenter: function(){
                    this.morph('.buttonHover');
                },
                mouseleave: function(){
                    this.morph('button');
                }            
            }
        });
        submitButton.inject(div);
        div.inject(form);
        return form;
    }    
});

/*
 * ThreadForm is used to add a new thread to the forum.
 */
var ThreadForm = new Class({
    initialize: function() {   
    },
    display: function() {
        var form = new Element('form', {
            'id' : 'newThreadForm',
            'action' : '#',
            'class' : 'grid_4',
            events: {
                submit: addThread
            }
        });
        var nameInput = new Element('input', {
            'type' : 'text',
            'name' : 'username',
            'value' : 'Name',
            'class' : 'grid_4',  
            events: {
                focus: function() {
                    if (this.value == 'Name') {
                        this.value = '';
                    }
                    this.tween('background-color', '#998a73');
                },
                blur: function(){
                    this.tween('background-color', '#877963')
                }
            }
        });
        var titleInput = new Element('input', {
            'type' : 'text',
            'name' : 'title',
            'value' : 'Thread title',
            'class' : 'grid_4',  
            events: {
                focus: function() {
                    if (this.value == 'Thread title') {
                        this.value = '';
                    }
                    this.tween('background-color', '#998a73');
                },
                blur: function(){
                    this.tween('background-color', '#877963')
                }
            }
        });
        nameInput.inject(form);
        titleInput.inject(form);
        var submitButton = new Element('input', {
            'type' : 'submit',
            'value' : 'Create Thread',
            'class' : 'grid_2',
            events: {
                mouseenter: function(){
                    this.morph('.buttonHover');
                },
                mouseleave: function(){
                    this.morph('button');
                }            
            }
        });
        submitButton.inject(form);
        return form;
    }    
});

/*
 * EditPostForm is added to the PostItem when the user wishes to edit
 * the content of a post.
 */
var EditPostForm = new Class({
    initialize: function(postId, content){
        this.id = postId;
        this.content = content;
    },
    display: function() {
        var form = new Element('form', {
            'id' : this.id + 'editPostForm',
            'action' : '#',
            'class' : 'grid_11',
            events: {
                submit: editPost
            }
        });        
        var postIdInput = new Element('input', {
            'name' : 'post_id',
            'value' : this.id,
            'type' : 'hidden'
        })
        var comment = new Element('textarea', {
            'name' : 'comment',
            'value' : this.content,
            'class' : 'grid_11 editPostFormStyle',
            events: {
                focus: function() {
                    this.tween('background-color', '#a9c3ba');
                },
                blur: function(){
                    this.tween('background-color', '#8caea2')
                }
            }
        });
        var submitButton = new Element('input', {
            'type' : 'submit',
            'value' : 'Edit',
            'class' : 'grid_1 editPostFormStyle',
            events: {
                mouseenter: function(){
                    this.tween('background-color', '#a9c3ba');
                },
                mouseleave: function(){
                    this.tween('background-color', '#8caea2')
                }            
            }
        });
        postIdInput.inject(form);
        comment.inject(form);
        submitButton.inject(form);
        return form;
    }    
});

/*
 * Edit Thread Form is used to change the title of a thread.
 */
var EditThreadForm = new Class({
    initialize: function(threadId, title){
        this.id = threadId;
        this.title = title;
    },
    display: function() {
        var form = new Element('form', {
            'id' : this.id + 'editThreadForm',
            'action' : '#',
            'class' : 'grid_7 editThreadForm',
            events: {
                submit: editThread
            },
            styles: {
                marginLeft: '0px'
            }
        });        
        var threadID = new Element('input', {
            'name' : 'thread_id',
            'value' : this.id,
            'type' : 'hidden'
        })
        var title = new Element('input', {
            'name' : 'title',
            'type' : 'text',
            'value' : this.title,
            'class' : 'grid_5 editPostFormStyle',
            events: {
                click: function(e){
                    e.stop();
                }     
            }
                
        });
        var submitButton = new Element('input', {
            'type' : 'submit',
            'value' : 'Edit',
            'class' : 'grid_1 editPostFormStyle'
        });
        threadID.inject(form);
        title.inject(form);
        submitButton.inject(form);
        return form;
    }    
});