from google.appengine.ext import ndb



class Item(ndb.Model):
    user = ndb.UserProperty(required=True)
    title = ndb.StringProperty(required=True)
    description = ndb.TextProperty()
    price = ndb.IntegerProperty()
    priority = ndb.IntegerProperty()
    date = ndb.DateTimeProperty(auto_now_add=True)
    
    
    def to_dict(self):
        dic = ndb.Model.to_dict(self, include=['title', 'description', 'price','priority','date'])
        dic['date'] = str(dic['date']).split('.')[0]
        dic['id'] = self.key.id()
        return dic