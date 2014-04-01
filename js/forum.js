var guestbook;
window.addEvent('domready', domReady);

function domReady() {
    var req = new Request.JSON({
        url: 'control.php?action=getThreadList',
        onSuccess: function(array){
            threadListSuccess(array);
            initThreadButton();
        }
    }).send();
}

/*
 * Called when the list of threads has been loaded.
 */
function threadListSuccess(jArray){
    jArray.each(function(thread){
        //Creates a thread list item for each thread
        var threadListItem = new ThreadListItem(thread.thread_id, thread.title, thread.username);
        threadListItem.display().inject($('content'));
    // Adds them to the DOM
    });
    // Adds the hover-over effect to each thread item
    $$('.threadItem').each(threadItemHoverOver);
}

/*
 * Sets up the displaying of posts when a thread has been chosen
 * Manages the hiding and showing of thread items
 */
function getThread() { 
    var id = this.get('id').toInt(); // ID of thread chosen
    if($(id+'editThreadForm') == null) { // If the thread title isn't being edited
        var open = this.get('open'); // Thread open status
        if (open == 'false') {  // If the thread isn't open      
            var req = new Request.JSON({
                url: 'control.php?action=getThread&id=' + id,
                onSuccess: function(array) {
                    if (array.length < 1) // If the thread has posts
                        getEmptyThread(id);
                    else
                        getThreadSuccess(array);
                }
            }).send();    
            this.set('open', 'true');
            hideOtherThreads();
        }
        else {
            this.set('open', 'false'); // If the thread is open and clicked
            $(id + 'container').dispose(); // Dispose of the thread posts
            showOtherThreads(); // Redisplay thread list
        }
    }
}

/*
 * Displays a thread with posts in it
 */
function getThreadSuccess(jArray){
    var threadContainer = new ThreadContainer(jArray[0].thread_id).show();
    jArray.each(function(post){
        var postObject = new PostItem(post.post_id, post.username, post.date_posted, post.comment);
        postObject.display().inject(threadContainer);
    });   
    var addPostButton = getPostButton(jArray[0].thread_id);
    addPostButton.inject($('buttonArea'));
    threadContainer.inject($('content'));
}

/*
 * Displays a thread with no posts in it
 */
function getEmptyThread(id) {
    var threadContainer = new ThreadContainer(id).show();
    var addPostButton = getPostButton(id);
    addPostButton.inject($('buttonArea'));
    threadContainer.inject($('content'));   
}

function addPost(e) {    
    e.stop();
    var req = new Request({
        url:'control.php?action=insertPost',
        onSuccess: updateThread
    }).post(this); 
}

/*
 * Updates a thread when a post has been added. Adds the newest post to DOM.
 */
function updateThread(id) {
    var req = new Request.JSON({
        url: 'control.php?action=getSinglePost&id=' + id,
        onSuccess: function(post) {  
            var postObject = new PostItem(post.post_id, post.username, post.date_posted, post.comment);
            postObject.display().inject($(post.thread_id + 'container'));  
            $('newPostForm').dispose();          
        }
    }).send();    
}

function addThread(e) {   
    e.stop();
    var req = new Request({
        url:'control.php?action=createThread',
        onSuccess: function() {            
            $$('.threadItem').dispose();
            var req = new Request.JSON({
                url: 'control.php?action=getThreadList',
                onSuccess: threadListSuccess
            }).send();
        }
    }).post(this);     
}

function deleteThread(e){
    e.stop();
    var id = this.get('id').toInt();
    var req = new Request({
        url:'control.php?action=deleteThread&id=' + id,
        onSuccess: function() {       
            $(id+'thread').dispose(); // remove thread list item
            if($('addPostButton') != null) { // If the page the thread (has posts)
                $(id + 'container').dispose(); // Remove the contained posts
                showOtherThreads();
            } 
        }
    }).post(this);      
}

function deletePost(e){
    e.stop();    
    var id = this.get('id').toInt();
    var req = new Request({
        url:'control.php?action=removePost&id=' + id,
        onSuccess: function() {       
            $(id+'post').dispose();
        }
    }).post(this);
}

/*
 * Displays the form used when editing the contents of a post.
 * Removes a form if used on a thread already being edited.
 */
function showEditPost(){
    var id = this.get('id').toInt();
    var content = $(id +'pComment').get('text'); // Current post text
    if ($(id+'editPostForm') == null) { // If there isn't already a form
        var editForm = new EditPostForm(id, content);
        $(id +'pComment').setStyle('display', 'none'); // Hide the comment
        editForm.display().inject($(id+'pComCont')); // Add the form
    }
    else { // If there is already a form
        $(id+'editPostForm').dispose(); // Remove the form
        $(id +'pComment').setStyle('display', 'block'); // Redisplay the comment
    }    
}

function editPost(e){    
    e.stop();
    var req = new Request({
        url:'control.php?action=editPost',
        onSuccess: updateEditedPost
    }).post(this); 
}

/*
 * Updates a post which has been edited with the correct text.
 */
function updateEditedPost(id){
    var req = new Request.JSON({
        url: 'control.php?action=getSinglePost&id=' + id,
        onSuccess: function(post) {  
            var postObject = new PostItem(post.post_id, post.username, post.date_posted, post.comment);
            // Replace the previous post
            postObject.display().replaces($(post.post_id + 'post'));  
        }
    }).send();          
}

/*
 *Displays the form used when editing the title of the thread.
 *Hides the form if it is already being used.
 */
function showEditThread(e){
    e.stop();    
    var id = this.get('id').toInt();
    var title = $(id +'title').get('text');
    if ($(id+'editThreadForm') == null) {
        var editForm = new EditThreadForm(id, title);
        $(id +'title').setStyle('display', 'none');
        editForm.display().inject($(id+'thread'), 'top');
    }
    else {
        $(id+'editThreadForm').dispose();
        $(id +'title').setStyle('display', 'block');
    }        
}

function editThread(e){
    e.stop();
    var req = new Request({
        url:'control.php?action=renameThread',
        onSuccess: updateEditedThread
    }).post(this); 
}

/*
 * Updates an edited thread title with the correct title.
 */
function updateEditedThread(id){
    var changed = $(id+'editThreadForm').getElement('[name=title]');
    changed = changed.get('value');
    $(id+'editThreadForm').dispose();
    var title = $(id +'title');
    title.set('text', changed);
    title.setStyle('display', 'block');    
}

/*
 * When a thread has been selected it displays just the thread list item
 * for that thread and hides all others.
 */
function hideOtherThreads() {
    var array = $$('.threadItem');
    var open = false;
    array.each(function(item){
        if(item.get('open') == 'true') {
            open = true;
        }
    });
    // If there is an opened item
    if (open == true) {
        array = $$('.threadItem[open = false]');
        // For each unopened thread item
        array.each(function(item){
            item.setStyles({
                'visibility' : 'hidden',
                'display':'none'
            });            
        });        
        // Not on thread page so dispose of thread button
        $('addThreadButton').dispose();
        if($('newThreadForm') != null) {
            // if the form has been opened dipose of it too
            $('newThreadForm').dispose();
        }
    }
}

/*
 * Shows the list of threads, makes visible any hidden threads
 */
function showOtherThreads() {
    var array = $$('.threadItem');
    array.each(function(item){
        if (item.getStyle('visibility') == 'hidden') {
            item.setStyles({
                visibility: 'visible',
                display: 'block'
            });            
        }    
    });
    // Not on post page so dispose of post button
    $('addPostButton').dispose();
    if($('newPostForm') != null) {
        // If the the form has been opened dispose of it too
        $('newPostForm').dispose();
    }
    // Add the thread button
    initThreadButton();
}

/*
 * Returns the add new post button with the link to the relevant thread
 */
function getPostButton(id){    
    var addPostButton = getCustomButton('Add New Post', 'addPostButton');
    addPostButton.addEvent('click', function(){
        if($('newPostForm') == null) {
            var postForm = new PostForm(id);
            postForm.display().inject($('formArea'));
        }
    });
    addPostButton.set('class', 'grid_2');
    var img = new Element('img', {
        'src' : 'images/comment_add.png',
        styles: {
            marginRight: '7px'
        }
    });
    img.inject(addPostButton, 'top');
    return addPostButton;
}

/*
 * Displays the button to add new threads
 */
function initThreadButton() {    
    var addThreadButton = getCustomButton('Add New Thread', 'addThreadButton');
    addThreadButton.set('class', 'grid_2');
    var img = new Element('img', {
        'src' : 'images/add.png',
        styles: {
            marginRight: '2px'
        }
    });
    addThreadButton.addEvent('click', function(){
        if($('newThreadForm') == null) {
            var threadForm = new ThreadForm();
            threadForm.display().inject($('formArea'));
        }
    });
    img.inject(addThreadButton, 'top');
    addThreadButton.inject($('buttonArea'));
}

/*
 * Adds the hover over effect to a given item
 */
function threadItemHoverOver(item) {
    item.addEvents({
        mouseenter: function(){
            this.morph({
                duration: 100,
                'background-color': '#6E9489',
                'border-color' : '#4b655d',
                'color' : '#d9e3e0'
            });
            var editForm = this.getElement('.editThreadForm');
            if (editForm != null){
                editForm.getElements('input').morph('.editPostFormStyle');
            }
        },
        mouseleave: function(){
            this.morph('.threadItem');
            var editForm = this.getElement('.editThreadForm');
            if (editForm != null){
                editForm.getElements('input').morph('.editThreadFormStyle');
            }
        }
    });
}

/*
 * Returns a custom button with the custom morph fx and desired id & text
 */
function getCustomButton(text, id) {
    var customButton = new Element('button',{
        'id' : id,
        'text' : text,
        events: {
            mouseenter: function(){
                this.morph('.buttonHover');
            },
            mouseleave: function(){
                this.morph('button');
            }            
        }
    });
    return customButton;
}
    