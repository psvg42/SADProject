import os

from google.appengine.api import users
import jinja2
import webapp2
from webapp2_extras import json
import logging
from server.models.Item import Item
from google.appengine.ext.ndb.model import Key
from google.appengine.ext.ndb.query import Cursor


WEBUI_TEMPLATES_DIR = os.path.join(os.path.dirname(__file__), 'webui_templates')
JINJA_ENV = jinja2.Environment(loader=jinja2.FileSystemLoader(WEBUI_TEMPLATES_DIR))
INDEX_TEMPLATE_PATH = 'index.html'

def getUser(handler,url):
    user = users.get_current_user()
    if not user:
        handler.redirect(users.create_login_url('/'))
    return user

def parseItemCursorResultToJSON(items):
    list_dict_item = []
    for item in items:
        list_dict_item.append(item.to_dict())
    return list_dict_item
    


class Start(webapp2.RequestHandler):
    
    def get(self):
        getUser(self, '/')
        self.response.write(JINJA_ENV.get_template(INDEX_TEMPLATE_PATH).render({}))
        
class GetUser(webapp2.RequestHandler):
    
    name_payload = 'user_name'
    link_payload = 'logout_url'
    
    def get(self):
        user = users.get_current_user()
        payload = {self.name_payload : 'No user',
                   self.link_payload : None}
        if user:
            payload[self.name_payload] = user.nickname()
            payload[self.link_payload] = users.create_logout_url('/')
            
        self.response.headers['Content-Type'] = 'application/json'
        self.response.write(json.encode(payload))


class AddItem(webapp2.RequestHandler):
    
    def post(self):
        title = unicode(self.request.get('title'))
        description = unicode(self.request.get('description'))
        price = int(unicode(self.request.get('price')))
        priority = int(unicode(self.request.get('priority')))
        logging.info('Title='+title)
        logging.info('Description='+description)
        logging.info('Price=' + str(price))
        logging.info('Priority=' + str(priority))
        
        item = Item(parent=Key('ParentItem',1))
        item.user = users.get_current_user()
        item.title = title
        item.description = description
        item.price = price
        item.priority = priority
        item.put()
        self.response.write(json.encode({}))
        
class GetItems(webapp2.RequestHandler):
    
    def get(self):
        answer = {}
        cursorStr = self.request.get('next')
        if (cursorStr == 'begin'):
            curs = Cursor()
        else:
            curs = Cursor(urlsafe=cursorStr)
        
        results,cursor,more = Item.query(Item.user == users.get_current_user()).order(-Item.priority).fetch_page(5,start_cursor=curs)
        
        logging.info(results)
        logging.info(cursor.urlsafe())
        
        items = parseItemCursorResultToJSON(results)
        
        logging.info(items)
        
        answer['items'] = items
        
        if(more): 
            answer['next'] = cursor.urlsafe()
        else:
            answer['next'] = 'end'
        self.response.headers['Content-Type'] = 'application/json'
        self.response.write(json.encode(answer))

        
routes = [
          webapp2.Route(r'/', handler=Start, name='home'),
          webapp2.Route(r'/get_user', handler=GetUser, name='security'),
          webapp2.Route(r'/add_item', handler=AddItem, name='add_item'),
          webapp2.Route(r'/get_items', handler=GetItems, name='get_items')
         ]

# Build WSGI app
app = webapp2.WSGIApplication(routes)