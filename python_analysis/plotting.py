import pandas as pd
import matplotlib.pyplot as plt

def plot_close_symbol(symbol):
    df = pd.read_csv('../data/{}/15MIN{}.csv'.format(symbol, symbol))
    df['c'].plot()
    plt.show()
    
def plot_open_close_symbol(symbol):
    df = pd.read_csv('../data/{}/15MIN_{}.csv'.format(symbol, symbol))
    df[['h','l']][:100].plot()
    plt.show()
    



plot_open_close_symbol('MSFT')