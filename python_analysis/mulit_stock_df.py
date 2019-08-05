import pandas as pd
import matplotlib.pyplot as plt

symbols = [ 'BAC', 'IBM', 'MSFT', 'AAPL', 'F', 'GE', 'INTC']

# def adjust_dates():#No need any more
#     for symbol in symbols:
#         df = load_data(symbol)
#         print(df.head())

#         time = df['t']*1000
#         df.drop('t', axis=1, inplace=True)
#         df['t'] = time
#         print(df.head())
#         save_csv(df, symbol)

def save_csv(data, symbol):
    data.to_csv('../data/{}/15MIN_{}.csv'.format(symbol, symbol), index=False)
    return True
    
def load_data_col(symbol, col):
    print('Loading {} column {}'.format(symbol, col))
    df = pd.read_csv('../data/{}/15MIN_{}.csv'.format(symbol, symbol),
                     usecols=['t','c', 'v'],
                     index_col='t')
    # df.index = pd.to_datetime(df.index,unit='ms')
    df = df.rename(columns={'c':symbol, 'v':'{}_vol'.format(symbol)})
    # print(df)
    return df

def load_data(symbol):
    df = pd.read_csv('../data/{}/15MIN_{}.csv'.format(symbol, symbol), index_col='t')
    # df = df.rename(columns={'c':symbol})
    # df.set_index('t', inplace=True)
    return df



# Get reference via SPY
def get_SPY_refrence():
    df = load_data_col('SPY', 'c')
    return df
    
    
def create_main_df(symbols):
    df = get_SPY_refrence()

    for symbol in symbols:
        df = df.join(load_data_col(symbol, 'c'))
    # print(df)
    # df.plot()
    # plt.show()
    return df

    

def plot_close_symbol(symbol):
    df = pd.read_csv('../data/{}/15MIN_{}.csv'.format(symbol, symbol))
    df['c'].plot()
    plt.show()
    
def plot_open_close_symbol(symbol):
    df = pd.read_csv('../data/{}/15MIN_{}.csv'.format(symbol, symbol))
    df[['h','l']][:100].plot()
    plt.show()
    
    
    


# USe SPY as a refrence

# df = create_main_df(symbols)

# print(len(df))

# df = df.loc[~df.index.duplicated(keep='first')]
# print(len(df))

# print(df[:15])

# why not just write this file..
# df.to_csv('./main_df.csv')


def plot_data(title="Stock Prices"):
    df = pd.read_csv('main_df.csv', index_col='t')
    df.index = pd.to_datetime(df.index,unit='ms')

    df = df/df.iloc[0, :]
    ax = df[symbols].plot(title=title, fontsize=12)
    ax.set_xlabel('Date')
    ax.set_ylabel('Price')
    plt.show()
    

    
plot_data()




