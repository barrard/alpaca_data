import pandas as pd
import numpy as np

# useless utils
def get_max_close(symbol):
    # return the maximum closing price for indicated symbol
    
    df = pd.read_csv('../data/{}/minutely_{}.csv'.format(symbol, symbol))
    max_close = df['c'].max()
    print('The max close for {} is {}'.format(symbol, max_close))
    return max_close
# useless utils
def get_mean_meadian_close(symbol):
    # return the maximum closing price for indicated symbol
    
    df = pd.read_csv('../data/{}/minutely_{}.csv'.format(symbol, symbol))
    mean_close = df['c'].mean()
    median_close = df['c'].median()
    print('The mean close for {} is {}, and the median is {}'.format(symbol, mean_close, median_close))
    return mean_close, median_close
    

def test_run():
    print('test')
    print(np.array([1, 2, 3, 4]))
#     create an emprt arrat
    print(np.empty(5))
    print(np.empty((5,4,3)))
    print(np.ones((5,4,3)))
    print(np.zeros((5,4,3)))
    print(np.random.random((5, 4)))#same
    print(np.random.rand(5, 4))#same
    print(np.random.normal(size=(5, 4)))
#     change the         mean and std
    print(np.random.normal(50,    10, size=(5, 4)))
    
#     generate integers
    print(np.random.randint(0, 10))
    print(np.random.randint(0, 10, size=100))
    print(np.random.randint(0, 10, size=(5, 5)))
    print(np.random.randint(0, 10, size=(5, 5, 5)))
    print(np.random.randint(0, 10, size=(5, 5, 5)).shape)
    print(len(np.random.randint(0, 10, size=(5, 5, 5)).shape))#len tells us the dimension
    print(np.random.randint(0, 10, size=(5, 5, 5)).shape[0])#Rows
    print(np.random.randint(0, 10, size=(5, 5, 5)).shape[1])#Columns
    print(np.random.randint(0, 10, size=(5, 5, 5)).size)#Number of elements

    
# get_max_close('MSFT')
test_run()