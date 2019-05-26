table=[0,4,0,0,0,6,0,6,4,0]
units=0
c=[0,0]
d=[0,0]
for i in range(0,len(table)):
    if(table[i]!=0 and c[1]==0):        
        c[0]=i
        c[1]=table[i]
    elif(table[i]!=0 and d[1]==0):        
        d[0]=i
        d[1]=table[i]
    if(c[1]!=0 and d[1]!=0):
        for j in range(c[0]+1,d[0]):            
            table[j]=min(c[1],d[1])
            units+=min(c[1],d[1])
        c[0]=d[0]
        c[1]=d[1]
        d=[0,0]

print(table)
print(units)