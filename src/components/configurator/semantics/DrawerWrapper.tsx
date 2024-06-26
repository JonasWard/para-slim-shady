import { Button, Drawer, Popover } from 'antd';
import React, { ReactNode } from 'react';
import { IoClose } from 'react-icons/io5';

interface IDrawerWrapperProps {
  open: boolean;
  toggleOpen: (open: boolean) => void;
  children: ReactNode;
  title: ReactNode;
  buttonIcon: ReactNode;
  disabled?: boolean;
}

export const DrawerWrapper: React.FC<IDrawerWrapperProps> = ({ open, toggleOpen, children, title, buttonIcon, disabled }) => {
  return (
    <>
      <Drawer
        placement='left'
        style={{ backgroundColor: '#ffffffb0', width: 'calc(100vw - 64px)' }}
        open={open}
        closable={false}
        mask={false}
        styles={{ wrapper: { width: 'calc(100vw - 64px)' } }}
        title={
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>{title}</span>
            <IoClose style={{ cursor: 'pointer' }} size={20} onClick={() => toggleOpen(false)} />
          </div>
        }
      >
        {children}
      </Drawer>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'end' }}>
        <Button disabled={disabled} onClick={() => toggleOpen(!open)} style={{ margin: 8, width: 20 }}>
          {buttonIcon}
        </Button>
      </div>
    </>
  );
};
